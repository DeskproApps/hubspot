import { useMemo } from "react";
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
    getDealsByContactId,
    getNotesByContactId,
    getCallsByContactId,
    getEmailsByContactId,
    getAccountInfoService,
    getEntityAssocService,
    getPropertiesMetaService,
} from "../../services/hubspot";
import { filterEntities, getScreenStructure, flatten } from "../../utils";
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

    const contactPropertiesMeta = useQueryWithClient(
        [QueryKey.PROPERTIES_META, "contact"],
        (client) => getPropertiesMetaService(client, "contacts"),
    );

    const dealPropertiesMeta = useQueryWithClient(
        [QueryKey.PROPERTIES_META, "deals"],
        (client) => getPropertiesMetaService(client, "deals"),
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
            select: (data) => (data?.results ?? []).map(({ properties }: Deal) => properties),
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
            select: (data) => (data?.results ?? []).map(({ properties }: EmailActivity) => properties),
        }
    );

    const callActivities = useQueryWithClient(
        [QueryKey.CALLS_BY_CONTACT_ID, contactId],
        (client) => getCallsByContactId(client, contactId),
        {
            enabled: !!contactId,
            select: (data) => (data?.results ?? []).map(({ properties }: CallActivity) => properties),
        },
    );

    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
    );

    const owners = useQueryWithClient(
        [QueryKey.OWNERS],
        getOwnersService,
        {
            select: (data) => {
                return (data?.results ?? []).reduce<Record<Owner["id"], Owner>>((acc, owner) => {
                    if (!acc.hasOwnProperty(owner.id)) {
                        acc[owner.id] = owner;
                    }
                    return acc;
                }, {});
            },
        },
    );

    return {
        isLoading: [linkedContactIds, contact, deals, contactPropertiesMeta].some(({ isLoading }) => isLoading),
        contact: contact.data?.properties,
        companies: filterEntities(companies) as Array<Company["properties"]>,
        deals: deals.data || [],
        notes: notes.data || [],
        emailActivities: emailActivities.data as Array<EmailActivity["properties"]>,
        callActivities: callActivities.data as Array<CallActivity["properties"]>,
        accountInfo: accountInfo.data,
        owners: owners.data as Record<Owner["id"], Owner>,
        contactMetaMap: useMemo(() => {
            return (contactPropertiesMeta.data?.results ?? []).reduce<Record<PropertyMeta["fieldType"], PropertyMeta>>((acc, meta) => {
                if (!acc[meta.name]) {
                    acc[meta.name] = meta;
                }
                return acc;
            }, {});
        }, [contactPropertiesMeta.data?.results]),
        dealMetaMap: useMemo(() => {
            return (dealPropertiesMeta.data?.results ?? []).reduce<Record<PropertyMeta["fieldType"], PropertyMeta>>((acc, meta) => {
                if (!acc[meta.name]) {
                    acc[meta.name] = meta;
                }
                return acc;
            }, {});
        }, [dealPropertiesMeta.data?.results]),
    } as const;
};

export { useLoadHomeDeps };