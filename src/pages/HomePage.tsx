import { useState } from "react";
import get from "lodash/get";
import { UseQueryResult } from "react-query/types/react/types";
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
    getAccountInfoService,
    getEntityAssocService,
    getCallActivityService,
    getEmailActivityService,
} from "../services/hubspot";
import { useSetAppTitle, useQueryWithClient, useQueriesWithClient } from "../hooks";
import { normalize } from "../utils";
import { QueryKey } from "../query";
import { Home } from "../components/Home";
import type { UserContext, ContextData } from "../types";
import type { Contact, Company, Deal, Note, EmailActivity, CallActivity } from "../services/hubspot/types";

function filterEntities(entities: UseQueryResult[]) {
    return entities?.filter((entity) => (entity.isFetched && entity.isSuccess))
        .map((entity) => (entity as { data: Company|Deal|Note|EmailActivity|CallActivity }).data.properties);
}

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

    const contactOwner = useQueryWithClient(
        [QueryKey.OWNERS, get(contact, ["data", "properties", "hubspot_owner_id"], 0)],
        (client) => getOwnersService(client, get(contact, ["data", "properties", "hubspot_owner_id"], 0)),
        { enabled: contact.isSuccess && get(contact, ["data", "properties", "hubspot_owner_id"], null) !== null }
    );

    const companies = useQueriesWithClient(companyIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.COMPANY, id],
        queryFn: (client) => getCompanyService(client, id),
        enabled: (companyIds.data?.results.length > 0),
    })) ?? []);

    const dealIds = useQueryWithClient(
        [QueryKey.DEALS, "contacts", contactId, "deals"],
        (client) => getEntityAssocService<Deal["id"], "contact_to_deal">(client, "contacts", contactId as string, "deals"),
        { enabled: !!contactId },
    );

    const deals = useQueriesWithClient(dealIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.DEALS, id],
        queryFn: (client) => getDealService(client, id),
        enabled: (dealIds.data?.results.length > 0),
    })) ?? []);

    const dealOwners = useQueriesWithClient(deals?.map((deal) => ({
        queryKey: [QueryKey.OWNERS, get(deal, ["data", "properties", "hubspot_owner_id"], 0)],
        queryFn: (client) => getOwnersService(client, get(deal, ["data", "properties", "hubspot_owner_id"], 0)),
        enabled: (deals.length > 0) && deals.every(({ isFetched, isSuccess }) => (isFetched && isSuccess)),
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

    const emailActivityIds = useQueryWithClient(
        [QueryKey.EMAIL_ACTIVITIES, "contacts", contactId, "emails"],
        (client) => getEntityAssocService<EmailActivity["id"], "contact_to_email">(client, "contacts", contactId as string, "emails"),
        { enabled: !!contactId }
    );

    const callActivityIds = useQueryWithClient(
        [QueryKey.CALL_ACTIVITIES, "contacts", contactId, "calls"],
        (client) => getEntityAssocService<CallActivity["id"], "contact_to_call">(client, "contacts", contactId as string, "calls"),
        { enabled: !!contactId }
    );

    const emailActivities = useQueriesWithClient(emailActivityIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.EMAIL_ACTIVITIES, id],
        queryFn: (client) => getEmailActivityService(client, id),
        enabled: (emailActivityIds.data?.results.length > 0),
    })) ?? []);

    const callActivities = useQueriesWithClient(callActivityIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.EMAIL_ACTIVITIES, id],
        queryFn: (client) => getCallActivityService(client, id),
        enabled: (callActivityIds.data?.results.length > 0),
    })) ?? []);

    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
    );

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

    if (!contact.isSuccess) {
        return <LoadingSpinner/>
    }

    return (
        <Home
            contact={contact.data.properties}
            contactOwner={contactOwner.data}
            companies={filterEntities(companies) as Array<Company["properties"]>}
            deals={filterEntities(deals) as Array<Deal["properties"]>}
            dealOwners={normalize(dealOwners)}
            notes={filterEntities(notes) as Array<Note["properties"]>}
            noteOwners={normalize(noteOwners)}
            emailActivities={filterEntities(emailActivities) as Array<EmailActivity["properties"]>}
            callActivities={filterEntities(callActivities) as Array<CallActivity["properties"]>}
            accountInfo={accountInfo.data}
        />
    );
};

export { HomePage };
