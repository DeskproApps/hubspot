import {
    getDealService,
    getOwnersService,
    getContactsService,
    getPipelinesService,
    getDealTypesService,
    getCompaniesService,
    getAccountInfoService,
    getDealPrioritiesService,
} from "../services/hubspot";
import { useQueryWithClient } from "../hooks";
import { QueryKey } from "../query";
import { getOption, noOwnerOption, getSymbolFromCurrency, getFullName } from "../utils";
import type {
    Deal,
    Owner,
    Contact,
    Company,
    Pipeline,
    DealTypeOption,
    DealPriorityOption,
} from "../services/hubspot/types";
import type { Option } from "../types";

type UseLoadUpdateDealDeps = (dealId?: Deal["id"]) => {
    isLoading: boolean,
    currency: string,
    pipelines: Pipeline[],
    deal: Deal["properties"],
    ownerOptions: Array<Option<Owner["id"]>>,
    dealTypeOptions: Array<Option<DealTypeOption["value"]>>,
    priorityOptions: Array<Option<DealPriorityOption["value"]>>,
    contactOptions: Array<Option<Contact["id"]>>,
    companyOptions: Array<Option<Company["id"]>>,
};

const useLoadUpdateDealDeps: UseLoadUpdateDealDeps = (dealId) => {
    const deal = useQueryWithClient(
        [QueryKey.DEALS, dealId],
        (client) => getDealService(client, dealId as Deal["id"]),
        {
            enabled: !!dealId,
        }
    );

    const pipelines = useQueryWithClient(
        [QueryKey.PIPELINES, "deals"],
        (client) => getPipelinesService(client, "deals"),
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
                const owners: Owner[] = data?.results ?? [];
                let options = [noOwnerOption];

                if (Array.isArray(owners) && owners.length > 0) {
                    options = [
                        ...options,
                        ...owners.map((owner) => getOption(owner.id, getFullName(owner))),
                    ];
                }

                return options;
            },
        },
    );

    const dealTypes = useQueryWithClient(
        [QueryKey.DEALS, "types"],
        getDealTypesService,
        {
            select: (data) => {
                return (data?.options ?? [] as DealTypeOption[])
                    .map(({ value, label }) => getOption(value, label));
            },
        }
    );

    const priorities = useQueryWithClient(
        [QueryKey.PROPERTIES, "deals", "priorities"],
        getDealPrioritiesService,
        {
            select: (data) => {
                return (data?.options ?? [] as DealPriorityOption[])
                    .map(({ value, label }) => getOption(value, label));
            },
        }
    );

    const contacts = useQueryWithClient(
        [QueryKey.CONTACTS],
        getContactsService,
        {
            select: (data) => {
                return (data?.results ?? [] as Contact[]).map((c) => {
                    return getOption(c.id, getFullName(c.properties));
                });
            },
        },
    );

    const companies = useQueryWithClient(
        [QueryKey.COMPANIES],
        getCompaniesService,
        {
            select: (data) => {
                return (data?.results ?? [] as Company[]).map(({ id, properties: { name } }) => {
                    return getOption(id, name);
                });
            }
        }
    );

    return {
        isLoading: [
            deal,
            owners,
            contacts,
            companies,
            pipelines,
            dealTypes,
            priorities,
            accountInfo,
        ].every(({ isLoading }) => Boolean(isLoading)),
        deal: (deal.data?.properties ?? []) as Deal["properties"],
        pipelines: pipelines.data?.results || [],
        currency: getSymbolFromCurrency(undefined, accountInfo.data),
        ownerOptions: owners.data || [],
        dealTypeOptions: dealTypes.data || [],
        priorityOptions: priorities.data || [],
        contactOptions: contacts.data || [],
        companyOptions: companies.data || [],
    };
};

export { useLoadUpdateDealDeps };
