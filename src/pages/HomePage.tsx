import { useState } from "react";
import get from "lodash/get";
import {
    Context,
    LoadingSpinner,
    useDeskproElements,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getEntityContactList } from "../services/entityAssociation";
import {
    getDealService,
    getNoteService,
    getOwnersService,
    getContactService,
    getCompanyService,
    getEntityAssocService,
} from "../services/hubspot";
import { useSetAppTitle, useQueryWithClient, useQueriesWithClient } from "../hooks";
import { QueryKey } from "../query";
import { Home } from "../components/Home";
import type { UserContext, ContextData } from "../types";
import type { Contact, Company, Deal, Note } from "../services/hubspot/types";

const filterEntities = (entities) => {
    return entities?.filter((entity) => (entity.isFetched && entity.isSuccess))
        .map((entity) => entity.data.properties)
};

const normalize = (source: undefined|any[], fieldName = "id") => {
    if (!Array.isArray(source)) {
        return {};
    }

    return source.reduce((acc, { data } = {}) => {
        if (data && data[fieldName]) {
            const key = data[fieldName];
            acc[key] = data;
        }

        return acc;
    }, {});
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

    const contactOwner = useQueryWithClient(
        [QueryKey.OWNERS, get(contact, ["data", "properties", "hubspot_owner_id"], 0)],
        (client) => getOwnersService(client, get(contact, ["data", "properties", "hubspot_owner_id"], 0)),
        { enabled: !!get(contact, ["data", "properties", "hubspot_owner_id"], 0) }
    );

    const dealIds = useQueryWithClient(
        [QueryKey.DEALS, "contacts", contactId, "deals"],
        (client) => getEntityAssocService<Deal["id"], "contact_to_deal">(client, "contacts", contactId as string, "deals"),
        { enabled: !!contactId },
    );

    const rawDeals = useQueriesWithClient(dealIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.DEALS, id],
        queryFn: (client) => getDealService(client, id),
        enabled: (dealIds.data?.results.length > 0),
    })) ?? []);

    const dealOwners = useQueriesWithClient(rawDeals?.map((deal) => ({
        queryKey: [QueryKey.OWNERS, get(deal, ["data", "properties", "hubspot_owner_id"], 0)],
        queryFn: (client) => getOwnersService(client, get(deal, ["data", "properties", "hubspot_owner_id"], 0)),
        enabled: (rawDeals.length > 0) && rawDeals.every(({ isFetched, isSuccess }) => (isFetched && isSuccess)),
    })) ?? []);

    const noteIds = useQueryWithClient(
        [QueryKey.NOTES, "contacts", contactId, "notes"],
        (client) => getEntityAssocService<Note["id"], "contact_to_note">(client, "contacts", contactId as string, "notes"),
        { enabled: !!contactId },
    );

    const notes = useQueriesWithClient(noteIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.NOTES, id],
        queryFn: (client) => getNoteService(client, id),
        enabled: (noteIds.data?.results.length > 0)
    })) ?? []);

    const noteOwners = useQueriesWithClient(notes?.map((note) => ({
        queryKey: [QueryKey, get(note, ["data", "properties", "hubspot_owner_id"], 0)],
        queryFn: (client) => getOwnersService(client, get(note, ["data", "properties", "hubspot_owner_id"], 0)),
        enabled: (notes.length > 0) && notes.every(({ isFetched, isSuccess }) => (isFetched && isSuccess)),
    })) ?? []);

    useSetAppTitle("Contact");

    useDeskproElements(({ registerElement }) => {
        registerElement("hubspotMenu", {
            type: "menu",
            items: [{
                title: "Unlink contact",
                payload: {type: "unlink", userId, contactId },
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

    if (!contact.isSuccess || !contactOwner.isSuccess) {
        return <LoadingSpinner/>
    }

    return (
        <Home
            contact={contact.data}
            contactOwner={contactOwner.data}
            companies={filterEntities(rawCompanies)}
            deals={filterEntities(rawDeals)}
            dealOwners={normalize(dealOwners)}
            notes={filterEntities(notes)}
            noteOwners={normalize(noteOwners)}
        />
    );
};

export { HomePage };
