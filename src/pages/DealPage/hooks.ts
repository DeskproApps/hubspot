import get from "lodash/get";
import { useQueriesWithClient, useQueryWithClient } from "../../hooks";
import {
    getDealService,
    getOwnerService,
    getCompanyService,
    getContactService,
    getPipelineService,
    getDealTypesService,
    getEntityAssocService,
    getAccountInfoService,
} from "../../services/hubspot";
import { QueryKey } from "../../query";
import { filterEntities } from "../../utils";
import type {
    Deal,
    Owner,
    Contact,
    Company,
    Pipeline,
    DealTypes,
    AccountInto,
} from "../../services/hubspot/types";

const useLoadDealDeps = (dealId?: Deal["id"]) => {
    const deal = useQueryWithClient<Deal>(
        [QueryKey.DEALS, dealId],
        (client) => getDealService(client, dealId as string),
        { enabled: !!dealId },
    );

    const pipeline = useQueryWithClient<Pipeline>(
        [QueryKey.PIPELINES, "deals", deal.data?.properties.pipeline],
        (client) => getPipelineService(client, "deals", deal.data?.properties.pipeline as string),
        { enabled: !!deal.data?.properties.pipeline }
    );

    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
    );

    const owner = useQueryWithClient(
        [QueryKey.OWNERS, get(deal, ["data", "properties", "hubspot_owner_id"], 0)],
        (client) =>  getOwnerService(client, get(deal, ["data", "properties", "hubspot_owner_id"], 0)),
        {
            enabled: !!get(deal, ["data", "properties", "hubspot_owner_id"], 0),
            useErrorBoundary: false,
        }
    );

    const dealTypes = useQueryWithClient([QueryKey.DEALS, "types"], getDealTypesService);

    const contactIds = useQueryWithClient(
        [QueryKey.ENTITY, "deals", dealId, "contacts"],
        (client) => getEntityAssocService<Contact["id"], "deal_to_contact">(client, "deals", dealId as string, "contacts"),
        { enabled: !!dealId },
    );

    const contacts = useQueriesWithClient(contactIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.CONTACT, id],
        queryFn: (client) => getContactService(client, id),
        enabled: (contactIds.data?.results.length > 0),
    })) ?? []);

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
            owner,
            pipeline,
            dealTypes,
            accountInfo,
            ...contacts,
            ...companies,
        ].every(({ isLoading }) => Boolean(isLoading)),
        deal: get(deal, ["data", "properties"], {}) as Deal["properties"],
        owner: get(owner, ["data"], {}) as Owner,
        pipeline: get(pipeline, ["data"], {}) as Pipeline,
        contacts: filterEntities(contacts) as Array<Contact["properties"]>,
        companies: filterEntities(companies) as Array<Company["properties"]>,
        dealTypes: get(dealTypes, ["data"], {}) as DealTypes,
        accountInfo: get(accountInfo, ["data"], {}) as AccountInto,
    };
};

export { useLoadDealDeps };
