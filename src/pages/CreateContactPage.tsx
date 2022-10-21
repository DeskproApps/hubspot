import { FC, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
    TwoButtonGroup,
    LoadingSpinner,
    useDeskproAppClient,
    useDeskproLatestAppContext, Context,
} from "@deskpro/app-sdk";
import { useQueryWithClient/*, useMutationWithQuery*/ } from "../hooks";
import { QueryKey } from "../query";
import { setEntityContact } from "../services/entityAssociation";
import {
    getOwnersService,
    getPipelineService,
    createContactService,
    getLeadStatusesService,
} from "../services/hubspot";
import { isValidationError } from "../services/hubspot/utils";
import { BaseContainer, ErrorBlock } from "../components/common";
import { ContactForm } from "../components";
import { getContactValues } from "../components/ContactForm/utils";
import type { Values } from "../components/ContactForm/types";
import type { ContextData } from "../types";

const CreateContactPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();
    const [error, setError] = useState<string|null>(null);

    const deskproUserId = (context as Context<ContextData>)?.data?.user.id;
    const primaryEmail = (context as Context<ContextData>)?.data?.user.primaryEmail;

    const owners = useQueryWithClient(
        [QueryKey.OWNERS],
        getOwnersService,
    );

    const lifecycleStages = useQueryWithClient(
        [QueryKey.PIPELINES, "contacts"],
        (client) => getPipelineService(client, "contacts", "contacts-lifecycle-pipeline"),
    );

    const leadStatuses = useQueryWithClient(
        [QueryKey.PROPERTIES, "contacts", "hs_lead_status"],
        getLeadStatusesService,
    );

    const onLinkContact = useCallback((contactId) => {
        if (!client || !deskproUserId || !contactId) {
            return;
        }

        setEntityContact(client, deskproUserId, contactId)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then((isSuccess: boolean) => {
                if (isSuccess) {
                    navigate("/home");
                }
            })
    }, [client, deskproUserId, navigate]);

    const onSubmit = async (values: Values) => {
        if (!client) {
            return;
        }

        setError(null);
        const data = getContactValues(values);

        // ToDo: replace to useMutation from react-query
        return createContactService(client, data)
            .then(({ id }) => {
                return onLinkContact(id);
            })
            .catch((err) => {
                if (isValidationError(err)) {
                    setError(err.message);
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
            {(owners.isLoading || lifecycleStages.isLoading || leadStatuses.isLoading)
                ? <LoadingSpinner />
                : <ContactForm
                    values={{ email: primaryEmail }}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    owners={owners.data?.results ?? []}
                    lifecycleStages={lifecycleStages.data?.stages ?? []}
                    leadStatuses={leadStatuses.data?.options ?? []}
                />
            }
        </BaseContainer>
    );
};

export { CreateContactPage };
