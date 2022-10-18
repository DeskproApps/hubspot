import { FC, useCallback } from "react";
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
import { BaseContainer } from "../components/common";
import { ContactForm } from "../components";
import { getContactValues } from "../components/ContactForm/utils";
import type { Values } from "../components/ContactForm/types";
import type { ContextData } from "../types";

const CreateContactPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext();

    const deskproUserId = (context as Context<ContextData>)?.data?.user.id;

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

    // const { mutateAsync, ...props } = useMutationWithQuery(
    //     [QueryKey.CONTACT, "create"],
    //     (client, data) =>  createContactService(client, data),
    //     {
    //         onSuccess: (res) => {
    //             console.log(">>> mutation:then:", res)
    //         },
    //         onError: (err) => {
    //             console.log(">>> mutation:catch:", JSON.parse(err.message));
    //         },
    //     }
    // );
    // console.log(">>> mutation:", { mutateAsync, ...props });

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

        const data = getContactValues(values);

        // await mutateAsync(data);

        return createContactService(client, data)
            .then(({ id }) => {
                return onLinkContact(id);
            })
            .catch(() => {})
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
            {(owners.isLoading || lifecycleStages.isLoading || leadStatuses.isLoading)
                ? <LoadingSpinner />
                : <ContactForm
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
