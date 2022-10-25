import { useMemo } from "react";
import get from "lodash/get";
import { useQueriesWithClient, useQueryWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import {
    getDealService,
    getNoteService,
    getOwnerService,
    getCompanyService,
    getContactService,
    getPipelineService,
    getAccountInfoService,
    getEntityAssocService,
    getCallActivityService,
    getEmailActivityService,
} from "../../services/hubspot";
import { normalize, filterEntities } from "../../utils";
import type {
    Deal,
    Note,
    Contact,
    Company,
    CallActivity,
    EmailActivity, Owner,
} from "../../services/hubspot/types";

const useLoadHomeDeps = (contactId: Contact["id"]|null) => {
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
        (client) => getOwnerService(client, get(contact, ["data", "properties", "hubspot_owner_id"], 0)),
        {
            enabled: !!get(contact, ["data", "properties", "hubspot_owner_id"], 0),
            useErrorBoundary: false,
        }
    );

    const companies = useQueriesWithClient(companyIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.COMPANY, id],
        queryFn: (client) => getCompanyService(client, id),
        enabled: (companyIds.data?.results.length > 0),
        useErrorBoundary: false,
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
        useErrorBoundary: false,
    })) ?? []);

    const dealOwners = useQueriesWithClient(deals?.map((deal) => ({
        queryKey: [QueryKey.OWNERS, get(deal, ["data", "properties", "hubspot_owner_id"], 0)],
        queryFn: (client) => getOwnerService(client, get(deal, ["data", "properties", "hubspot_owner_id"], 0)),
        enabled: (deals.length > 0) && deals.every(({ isFetched, isSuccess }) => (isFetched && isSuccess)),
        useErrorBoundary: false,
    })) ?? []);

    const noteIds = useQueryWithClient(
        [QueryKey.NOTES, "contacts", contactId, "notes"],
        (client) => getEntityAssocService<Note["id"], "contact_to_note">(client, "contacts", contactId as string, "notes"),
        { enabled: !!contactId },
    );

    const notes = useQueriesWithClient(noteIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.NOTES, id],
        queryFn: (client) => getNoteService(client, id),
        enabled: (noteIds.data?.results.length > 0),
        useErrorBoundary: false,
    })) ?? []);

    const noteOwners = useQueriesWithClient(notes?.map((note) => ({
        queryKey: [QueryKey, get(note, ["data", "properties", "hubspot_owner_id"], 0)],
        queryFn: (client) => getOwnerService(client, get(note, ["data", "properties", "hubspot_owner_id"], 0)),
        enabled: (notes.length > 0) && notes.every(({ isFetched, isSuccess }) => (isFetched && isSuccess)),
        useErrorBoundary: false,
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
        useErrorBoundary: false,
    })) ?? []);

    const callActivities = useQueriesWithClient(callActivityIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.EMAIL_ACTIVITIES, id],
        queryFn: (client) => getCallActivityService(client, id),
        enabled: (callActivityIds.data?.results.length > 0),
        useErrorBoundary: false,
    })) ?? []);

    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
    );

    const dealPipelines = useQueriesWithClient(deals?.map((deal) => ({
        queryKey: [QueryKey.PIPELINES, deal.data?.properties.pipeline],
        queryFn: (client) => getPipelineService(client, "deals", deal.data?.properties.pipeline as string),
        enabled: (deals.length > 0) && deals.every(({ isFetched, isSuccess }) => (isFetched && isSuccess)),
        useErrorBoundary: false,
    })) ?? []);

    const dealPipelinesData = useMemo(() => {
        if (!dealPipelines.every(({ isFetched, isSuccess }) => (isFetched && isSuccess))) {
            return {};
        }

        return normalize(dealPipelines);
    }, [dealPipelines]);

    return {
        isLoading: [contact].every(({ isLoading }) => Boolean(isLoading)),
        contact: get(contact, ["data", "properties"], {}) as Contact["properties"],
        contactOwner: get(contactOwner, ["data"], {}) as Owner,
        companies: filterEntities(companies) as Array<Company["properties"]>,
        deals: filterEntities(deals) as Array<Deal["properties"]>,
        dealOwners: normalize(dealOwners),
        dealPipelines: dealPipelinesData,
        notes: filterEntities(notes) as Array<Note["properties"]>,
        noteOwners: normalize(noteOwners),
        emailActivities: filterEntities(emailActivities) as Array<EmailActivity["properties"]>,
        callActivities: filterEntities(callActivities) as Array<CallActivity["properties"]>,
        accountInfo: accountInfo.data,
    } as const;
};

export { useLoadHomeDeps };
