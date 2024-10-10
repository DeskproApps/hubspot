import { FC, useState, useCallback } from "react";
import isEmpty from "lodash/isEmpty";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { queryClient } from "../../query";
import { useSetAppTitle } from "../../hooks";
import { useLoadActivityDeps } from "./hooks";
import {
    setEntityAssocService,
    createActivityCallService,
    createActivityEmailService,
} from "../../services/hubspot";
import { isValidationError } from "../../services/hubspot/utils";
import {
    ActivityForm,
    getCallActivityValues,
    getEmailActivityValues,
} from "../../components/ActivityForm";
import { ErrorBlock, BaseContainer } from "../../components/common";
import type { Values } from "../../components/ActivityForm/types";

const CreateActivityPage: FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const contactId = searchParams.get("contactId") || undefined;
    const { client } = useDeskproAppClient();
    const {
        isLoading,
        dealOptions,
        contactOptions,
        companyOptions,
        callDirectionOptions,
        callDispositionOptions,
    } = useLoadActivityDeps(contactId);

    const [error, setError] = useState<string|null>(null);

    useSetAppTitle("Log activity");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");

        registerElement("home", {
            type: "home_button",
            payload: { type: "changePage", path: `/home` },
        });
    });

    const onSubmit = (values: Values) => {
        if (!client || !contactId) {
            return;
        }

        setError(null);

        const type = values.activityType.value as "call"|"email";
        const activityType = (type === "call") ? "calls" : "emails";
        const getActivityValues = (type === "call")
            ? getCallActivityValues({ contact: contactOptions[0] })
            : getEmailActivityValues();
        const createActivityService = (type === "call") ? createActivityCallService : createActivityEmailService;

        return createActivityService(client, getActivityValues(values))
            .then(({ id: activityId }) => Promise.all([
                ...(isEmpty(values.associateContact)
                    ? [Promise.resolve()]
                    : values.associateContact.map(
                        (contactId) => setEntityAssocService(client, activityType, activityId, "contact", contactId, `${type}_to_contact`)
                    )),
                ...(isEmpty(values.associateCompany)
                    ? [Promise.resolve()]
                    : values.associateCompany.map(
                        (companyId) => setEntityAssocService(client, activityType, activityId, "company", companyId, `${type}_to_company`)
                    )),
                ...(isEmpty(values.associateDeal)
                    ? [Promise.resolve()]
                    : values.associateDeal.map(
                        (dealId) => setEntityAssocService(client, activityType, activityId, "deal", dealId, `${type}_to_deal`)
                    )),
            ]))
            .then(() => queryClient.invalidateQueries())
            .then(() => navigate("/home"))
            .catch((err) => {
                if (isValidationError(err)) {
                    setError(err.message);
                } else {
                    throw new Error(err);
                }
            });
    };

    const onCancel = useCallback(() => navigate("/home"), [navigate]);

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <>
            {error && (
                <BaseContainer>
                    <ErrorBlock texts={[error]}/>
                </BaseContainer>
            )}
            <ActivityForm
                initValues={{ contactId } as { contactId: string }}
                dealOptions={dealOptions}
                companyOptions={companyOptions}
                contactOptions={contactOptions}
                callDirectionOptions={callDirectionOptions}
                callDispositionOptions={callDispositionOptions}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </>
    );
};

export { CreateActivityPage };
