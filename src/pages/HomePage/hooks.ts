import { useMemo } from "react";
import get from "lodash/get";
import has from "lodash/has";
import { useNavigate } from "react-router-dom";
import { QueryKey } from "../../query";
import { DeskproError } from "../../services/hubspot";
import {
    useUnlinkContact,
    useQueryWithClient,
    useQueriesWithClient,
} from "../../hooks";
import {
    getOwnersService,
    getCompanyService,
    getContactService,
    getPipelineService,
    getDealsByContactId,
    getNotesByContactId,
    getCallsByContactId,
    getEmailsByContactId,
    getAccountInfoService,
    getEntityAssocService,
} from "../../services/hubspot";
import { normalize, filterEntities } from "../../utils";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type {
    Note,
    Deal,
    Owner,
    Contact,
    Company,
    CallActivity,
    EmailActivity,
} from "../../services/hubspot/types";

const useLoadHomeDeps = (contactId: Contact["id"]|null) => {
    const navigate = useNavigate();
    const { unlinkContact } = useUnlinkContact();

    const contact = useQueryWithClient(
        [QueryKey.CONTACT, contactId],
        (client) => getContactService(client, contactId as string),
        {
            enabled: !!contactId,
            useErrorBoundary: false,
            onError: (err) => {
                if (err instanceof DeskproError && err.code === 404) {
                    unlinkContact(
                        contactId as Contact["id"],
                        () => navigate("/link"),
                    );
                }
            },
        },
    );

    const companyIds = useQueryWithClient(
        [QueryKey.ENTITY, "contacts", contactId, "companies"],
        (client) => getEntityAssocService<Company["id"], "contact_to_company">(client, "contacts", contactId as string, "companies"),
        { enabled: !!contactId },
    );

    const companies = useQueriesWithClient(companyIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.COMPANY, id],
        queryFn: (client) => getCompanyService(client, id),
        enabled: (companyIds.data?.results.length > 0),
    })) ?? []);

    const deals = useQueryWithClient(
        [QueryKey.DEALS_BY_CONTACT_ID, contactId],
        (client) => getDealsByContactId(client, contactId as Contact["id"]),
        {
            enabled: !!contactId,
            cacheTime: 0,
            select: (data) => get(data, ["results"], []).map(({ properties }: Deal) => properties),
        },
    );

    const notes = useQueryWithClient(
        [QueryKey.NOTES_BY_CONTACT_ID, contactId],
        (client) => getNotesByContactId(client, contactId as Contact["id"]),
        {
            enabled: !!contactId,
            cacheTime: 0,
            select: (data) => get(data, ["results"], []).map(({ properties }: Note) => properties),
        },
    );

    const emailActivities = useQueryWithClient(
        [QueryKey.EMAILS_BY_CONTACT_ID, contactId],
        (client) => getEmailsByContactId(client, contactId as Contact["id"]),
        {
            enabled: !!contactId,
            select: (data) => get(data, ["results"], []).map(({ properties }: EmailActivity) => properties),
        }
    );

    const callActivities = useQueryWithClient(
        [QueryKey.CALLS_BY_CONTACT_ID, contactId],
        (client) => getCallsByContactId(client, contactId as Contact["id"]),
        {
            enabled: !!contactId,
            select: (data) => get(data, ["results"], []).map(({ properties }: CallActivity) => properties),
        },
    );

    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
    );

    const dealPipelines = useQueriesWithClient(deals.data?.map((deal: Deal["properties"]) => ({
        queryKey: [QueryKey.PIPELINES, deal.pipeline],
        queryFn: (client: IDeskproClient) => getPipelineService(client, "deals", deal.pipeline as string),
        enabled: Boolean(deals.data.length) && deals.isFetched && deals.isSuccess,
    })) ?? []);

    const dealPipelinesData = useMemo(() => {
        if (!dealPipelines.every(({ isFetched, isSuccess }) => (isFetched && isSuccess))) {
            return {};
        }

        return normalize(dealPipelines);
    }, [dealPipelines]);

    const owners = useQueryWithClient([
        QueryKey.OWNERS],
        getOwnersService,
        {
            select: (data) => {
                return (get(data, ["results"]) || []).reduce<Record<Owner["id"], Owner>>((acc, owner) => {
                    if (!has(acc, [owner.id])) {
                        acc[owner.id] = owner;
                    }
                    return acc;
                }, {});
            },
        },
    );

    return {
        isLoading: [contact].every(({ isLoading }) => Boolean(isLoading)),
        contact: get(contact, ["data", "properties"], {}) as Contact["properties"],
        companies: filterEntities(companies) as Array<Company["properties"]>,
        deals: deals.data || [],
        dealPipelines: dealPipelinesData,
        notes: notes.data || [],
        emailActivities: emailActivities.data as Array<EmailActivity["properties"]>,
        callActivities: callActivities.data as Array<CallActivity["properties"]>,
        accountInfo: accountInfo.data,
        owners: owners.data as Record<Owner["id"], Owner>,
    } as const;
};

export { useLoadHomeDeps };
