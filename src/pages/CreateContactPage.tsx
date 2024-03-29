import { FC, useState, useCallback, useMemo } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
    Context,
    TwoButtonGroup,
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import {
    useLinkContact,
    useLinkUnlinkNote,
    useLoadUpdateContactDeps,
} from "../hooks";
import { setEntityContact } from "../services/entityAssociation";
import { createContactService } from "../services/hubspot";
import { isValidationError, isConflictError } from "../services/hubspot/utils";
import { getEntityMetadata } from "../utils";
import { BaseContainer, ErrorBlock } from "../components/common";
import { ContactForm } from "../components";
import { getContactValues } from "../components/ContactForm/utils";
import type { Contact } from "../services/hubspot/types";
import type { Values, FormErrors } from "../components/ContactForm/types";
import type { ContextData } from "../types";

const CreateContactPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: Context<ContextData> };
    const { linkContactFn } = useLinkUnlinkNote();
    const { getContactInfo } = useLinkContact();
    const {
        owners,
        isLoading,
        leadStatuses,
        lifecycleStages,
    } = useLoadUpdateContactDeps();

    const [error, setError] = useState<string|null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors|null>(null);

    const deskproUser = useMemo(() => get(context, ["data", "user"]), [context]);

    useDeskproElements(({ deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");
    });

    const onLinkContact = useCallback((contactId: Contact["id"]) => {
        if (!client || !deskproUser?.id || !contactId) {
            return;
        }

        return getContactInfo(contactId)
            .then((data) => {
                return setEntityContact(client, deskproUser.id, contactId, getEntityMetadata(data))
            })
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then((isSuccess: boolean) => {
                if (isSuccess) {
                    return linkContactFn(contactId).then(() => navigate("/home"));
                }
            })
    }, [client, deskproUser, navigate, linkContactFn, getContactInfo]);

    const onSubmit = async (values: Values) => {
        if (!client) {
            return;
        }

        setError(null);
        setFormErrors(null);
        const data = getContactValues(values);

        // ToDo: replace to useMutation from react-query
        return createContactService(client, data)
            .then(({ id }) => {
                return onLinkContact(id);
            })
            .catch((err) => {
                if (isValidationError(err)) {
                    setError(err.message);
                } else if (isConflictError(err)) {
                    setFormErrors((state) => ({ ...state, email: err.message }) as FormErrors);
                } else {
                    throw new Error(err);
                }
            })
    };

    const onCancel = () => {
        navigate("/home");
    };

    const onNavigateToLinkContact = useCallback(() => {
        navigate("/link");
    }, [navigate]);

    return (
        <BaseContainer>
            <TwoButtonGroup
                selected="two"
                oneLabel="Find contact"
                oneIcon={faSearch}
                oneOnClick={onNavigateToLinkContact}
                twoLabel="Create contact"
                twoIcon={faPlus}
                twoOnClick={() => {}}
            />
            {error && <ErrorBlock text={error}/>}
            {isLoading
                ? <LoadingSpinner />
                : <ContactForm
                    initValues={{
                        email: get(deskproUser, ["primaryEmail"]),
                        firstName: get(deskproUser, ["firstName"]),
                        lastName: get(deskproUser, ["lastName"]),
                    }}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    formErrors={formErrors}
                    owners={owners}
                    lifecycleStages={lifecycleStages}
                    leadStatuses={leadStatuses}
                />
            }
        </BaseContainer>
    );
};

export { CreateContactPage };
