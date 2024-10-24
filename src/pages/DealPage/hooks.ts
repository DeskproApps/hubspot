import { useMemo } from "react";
import get from "lodash/get";
import { useQueriesWithClient, useQueryWithClient } from "../../hooks";
import {
    getDealService,
    getCompanyService,
    getContactService,
    getEntityAssocService,
    getAccountInfoService,
    getPropertiesMetaService,
} from "../../services/hubspot";
import { QueryKey } from "../../query";
import { filterEntities } from "../../utils";
import type {
    Deal,
    Contact,
    Company,
    AccountInto,
    PropertyMeta,
} from "../../services/hubspot/types";

const useLoadDealDeps = (dealId?: Deal["id"]) => {
    const deal = useQueryWithClient<Deal>(
        [QueryKey.DEALS, dealId],
        (client) => getDealService(client, dealId as string),
        { enabled: !!dealId },
    );

    const dealPropertiesMeta = useQueryWithClient(
        [QueryKey.PROPERTIES_META, "deals"],
        (client) => getPropertiesMetaService(client, "deals"),
    );

    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
    );

    // ToDo: rewrite to search api (getAssocEntitiesByContactId)
    const contactIds = useQueryWithClient(
        [QueryKey.ENTITY, "deals", dealId, "contacts"],
        (client) => getEntityAssocService<Contact["id"], "deal_to_contact">(client, "deals", dealId as string, "contacts"),
        { enabled: !!dealId },
    );

    // ToDo: rewrite to search api
    const contacts = useQueriesWithClient(contactIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.CONTACT, id],
        queryFn: (client) => getContactService(client, id),
        enabled: (contactIds.data?.results.length > 0),
    })) ?? []);

    // ToDo: rewrite to search api (getAssocEntitiesByContactId)
    const companyIds = useQueryWithClient(
        [QueryKey.ENTITY, "deals", dealId, "companies"],
        (client) => getEntityAssocService<Company["id"], "deal_to_company">(client, "deals", dealId as string, "companies"),
        { enabled: !!dealId }
    );

    const companies = useQueriesWithClient(companyIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.CONTACT, id],
        queryFn: (client) => getCompanyService(client, id),
        enabled: (companyIds.data?.results.length > 0),
        useErrorBoundary: false,
    })) ?? []);

    return {
        isLoading: [
            deal,
            accountInfo,
            dealPropertiesMeta,
            ...contacts,
            ...companies,
        ].some(({ isLoading }) => Boolean(isLoading)),
        deal: get(deal, ["data", "properties"], {}) as Deal["properties"],
        contacts: filterEntities(contacts) as Array<Contact["properties"]>,
        companies: filterEntities(companies) as Array<Company["properties"]>,
        accountInfo: get(accountInfo, ["data"], {}) as AccountInto,
        dealMetaMap: useMemo(() => {
            return (dealPropertiesMeta.data?.results ?? []).reduce<Record<PropertyMeta["fieldType"], PropertyMeta>>((acc, meta) => {
                if (!acc[meta.name]) {
                    acc[meta.name] = meta;
                }
                return acc;
            }, {});
        }, [dealPropertiesMeta.data?.results]),
    };
};

export { useLoadDealDeps };
