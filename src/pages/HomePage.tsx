import { useState, useEffect } from "react";
import get from "lodash/get";
import {
    Context,
    LoadingSpinner,
    useDeskproElements,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import {
    getEntityContactList,
} from "../services/entityAssociation";
import {
    getOwnersService,
    getContactService,
    getCompanyService,
    getEntityAssocService,
} from "../services/hubspot";
import { useSetAppTitle, useQueryWithClient, useQueriesWithClient } from "../hooks";
import { QueryKey } from "../query";
import { Home } from "../components/Home";
import type { UserContext, ContextData } from "../types";
import type { Contact, Company } from "../services/hubspot/types";

const filterCompanies = (companies) => {
    return companies?.filter((company) => (company.isFetched && company.isSuccess))
        .map((company) => company.data.properties)
};

const HomePage = () => {
    const { context } = useDeskproLatestAppContext() as { context: UserContext };

    const [contactId, setContactId] = useState<Contact["id"]|null>(null);

    const userId = (context as Context<ContextData>)?.data?.user.id;

    const contact = useQueryWithClient(
        [QueryKey.CONTACT, contactId],
        (client) => getContactService(client, contactId as string),
        { enabled: !!contactId },
    );

    const companyIds = useQueryWithClient(
        [QueryKey.ENTITY, "contacts", contactId, "companies"],
        (client) => getEntityAssocService<Company["id"], "contact_to_company">(client, "contacts", contactId as string, "companies"),
        { enabled: !!contactId },
    );

    const rawCompanies = useQueriesWithClient(companyIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.COMPANY, id],
        queryFn: (client) => getCompanyService(client, id),
        enabled: (companyIds.data?.results.length > 0),
    })) ?? []);

    const owner = useQueryWithClient(
        [QueryKey.OWNERS, get(contact, ["data", "properties", "hubspot_owner_id"], 0)],
        (client) => getOwnersService(client, get(contact, ["data", "properties", "hubspot_owner_id"], 0)),
        { enabled: !!get(contact, ["data", "properties", "hubspot_owner_id"], 0) }
    );

    console.log(">>> owner:", owner);

    useSetAppTitle("Contact");

    useDeskproElements(({ registerElement }) => {
        registerElement("hubspotMenu", {
            type: "menu",
            items: [{
                title: "Unlink contact",
                payload: {
                    type: "unlink",
                    userId,
                    contactId,
                },
            }],
        });
    }, [userId, contactId]);

    useInitialisedDeskproAppClient((client) => {
        if (!userId) {
            return;
        }

        getEntityContactList(client, userId)
            .then((contactIds) => {
                if (contactIds.length !== 0) {
                    setContactId(contactIds[0]);
                }
            })
    }, [userId]);

    if (!contact.isSuccess || !owner.isSuccess) {
        return <LoadingSpinner/>
    }

    return (
        <Home
            contact={contact.data}
            owner={owner.data}
            companies={filterCompanies(rawCompanies)}
        />
    );
};

export { HomePage };
