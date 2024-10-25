import { useMemo } from "react";
import get from "lodash/get";
import has from "lodash/has";
import { useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { QueryKey } from "../../query";
import { getEntityContactList } from "../../services/entityAssociation";
import {
    useUnlinkContact,
    useQueryWithClient,
    useQueriesWithClient,
} from "../../hooks";
import {
    DeskproError,
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
    getPropertiesMetaService,
} from "../../services/hubspot";
import { normalize, filterEntities, getScreenStructure, flatten } from "../../utils";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { DeskproUser, ContextData, Settings } from "../../types";
import type {
    Note,
    Deal,
    Owner,
    Company,
    CallActivity,
    EmailActivity,
    PropertyMeta,
} from "../../services/hubspot/types";

const useLoadHomeDeps = () => {
    const { unlinkContact } = useUnlinkContact();
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const userId = context?.data?.user.id;

    const structure = getScreenStructure(context?.settings, "contact", "home");

    const linkedContactIds = useQueryWithClient(
        [QueryKey.LINKED_CONTACTS, userId],
        (client) => getEntityContactList(client, userId as DeskproUser["id"]),
        { enabled: Boolean(userId) },
    );

    const contactId = (linkedContactIds?.data ?? [])[0];

    const contact = useQueryWithClient(
        [QueryKey.CONTACT, contactId],
        (client) => getContactService(client, contactId, flatten(structure)),
        {
            enabled: !!contactId,
            useErrorBoundary: false,
            onError: (err) => {
                if (err instanceof DeskproError && err.code === 404) {
                    unlinkContact(contactId);
                }
            },
        },
    );

    const propertiesMeta = useQueryWithClient(
        [QueryKey.PROPERTIES_META, "contact"],
        (client) => getPropertiesMetaService(client, "contacts"),
    );

    const companyIds = useQueryWithClient(
        [QueryKey.ENTITY, "contacts", contactId, "companies"],
        (client) => getEntityAssocService<Company["id"], "contact_to_company">(client, "contacts", contactId, "companies"),
        { enabled: !!contactId },
    );

    const companies = useQueriesWithClient(companyIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.COMPANY, id],
        queryFn: (client) => getCompanyService(client, id),
        enabled: (companyIds.data?.results.length > 0),
    })) ?? []);

    const deals = useQueryWithClient(
        [QueryKey.DEALS_BY_CONTACT_ID, contactId],
        (client) => getDealsByContactId(client, contactId),
        {
            enabled: !!contactId,
            cacheTime: 0,
            select: (data) => get(data, ["results"], []).map(({ properties }: Deal) => properties),
        },
    );

    const notes = useQueryWithClient(
        [QueryKey.NOTES_BY_CONTACT_ID, contactId],
        (client) => getNotesByContactId(client, contactId),
        {
            enabled: !!contactId,
            cacheTime: 0,
            select: (data) => (data?.results ?? []).map(({ properties }: Note) => properties),
        },
    );

    const emailActivities = useQueryWithClient(
        [QueryKey.EMAILS_BY_CONTACT_ID, contactId],
        (client) => getEmailsByContactId(client, contactId),
        {
            enabled: !!contactId,
            select: (data) => get(data, ["results"], []).map(({ properties }: EmailActivity) => properties),
        }
    );

    const callActivities = useQueryWithClient(
        [QueryKey.CALLS_BY_CONTACT_ID, contactId],
        (client) => getCallsByContactId(client, contactId),
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
        queryFn: (client: IDeskproClient) => getPipelineService(client, "deals", deal.pipeline),
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
        isLoading: [linkedContactIds, contact, propertiesMeta].some(({ isLoading }) => isLoading),
        contact: contact.data?.properties,
        companies: filterEntities(companies) as Array<Company["properties"]>,
        deals: deals.data || [],
        dealPipelines: dealPipelinesData,
        notes: notes.data || [],
        emailActivities: emailActivities.data as Array<EmailActivity["properties"]>,
        callActivities: callActivities.data as Array<CallActivity["properties"]>,
        accountInfo: accountInfo.data,
        owners: owners.data as Record<Owner["id"], Owner>,
        contactMetaMap: useMemo(() => {
            return (propertiesMeta.data?.results ?? []).reduce<Record<PropertyMeta["fieldType"], PropertyMeta>>((acc, meta) => {
                if (!acc[meta.name]) {
                    acc[meta.name] = meta;
                }
                return acc;
            }, {});
        }, [propertiesMeta.data?.results]),
    } as const;
};

export { useLoadHomeDeps };
