import get from "lodash/get";
import has from "lodash/has";
import { useQueryWithClient, useQueriesWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import {
    getContactService,
    getEntityAssocService,
    getActivityCallDirectionServices,
    getActivityCallDispositionsServices, getCompanyService, getDealService,
} from "../../services/hubspot";
import { getFullName, getOption } from "../../utils";
import type { Contact, CallDispositions, CallDirectionOption } from "../../services/hubspot/types";
import type { Option } from "../../types";
import {Company, Deal} from "../../services/hubspot/types";

type UseLoadActivityDeps = (contactId?: Contact["id"]) => {
    isLoading: boolean,
    contactOptions: Array<Option<Contact["id"]>>,
    companyOptions: Array<Option<Company["id"]>>,
    dealOptions: Array<Option<Deal["id"]>>,
    callDispositionOptions: Array<Option<CallDispositions["id"]>>,
    callDirectionOptions: Array<Option<CallDirectionOption["value"]>>,
};

const useLoadActivityDeps: UseLoadActivityDeps = (contactId) => {
    const contact = useQueryWithClient(
        [QueryKey.CONTACT, contactId],
        (client) => getContactService(client, contactId as Contact["id"]),
        {
            enabled: !!contactId,
            select: (data) => {
                return [{
                    ...getOption(data.id, getFullName({
                        firstName: get(data, ["properties", "firstname"]),
                        lastName: get(data, ["properties", "lastname"]),
                    })),
                    selected: true,
                }];
            }
        }
    );

    const callDispositions = useQueryWithClient(
        [QueryKey.CALL_ACTIVITIES, "dispositions"],
        getActivityCallDispositionsServices,
        {
            select: (data) => {
                return data?.filter(({ deleted }) => !deleted)
                    .map(({ id, label }) => getOption<CallDispositions["id"]>(id, label)) || [];
            },
        },
    );

    const callDirections = useQueryWithClient(
        [QueryKey.CALL_ACTIVITIES, "directions"],
        getActivityCallDirectionServices,
        {
            select: (data) => {
                return data.options?.filter(({ hidden }) => !hidden)
                    .map(({ value, label }) => getOption(value, label))
            },
        },
    );

    /// Associate entities

    const companyIds = useQueryWithClient(
        [QueryKey.ENTITY, "contacts", contactId, "companies"],
        (client) => getEntityAssocService<Company["id"], "contact_to_company">(client, "contacts", contactId as string, "companies"),
        { enabled: !!contactId },
    );

    const companies = useQueriesWithClient(companyIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.COMPANY, id],
        queryFn: (client) => getCompanyService(client, id),
        enabled: (companyIds.data?.results.length > 0),
        useErrorBoundary: false,
        select: (data) => {
            return (has(data, ["id"]) && has(data, ["properties", "name"]))
                ? {
                    ...getOption(data.id, data.properties.name),
                    selected: true,
                }
                : undefined;
        },
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
        select: (data) => {
            return (has(data, ["id"]) && has(data, ["properties", "dealname"]))
                ? getOption(data.id, data.properties.dealname)
                : undefined;
        },
    })) ?? []);

    return {
        isLoading: [
            contact,
            callDirections,
            callDispositions,
            ...companies,
        ].every(({ isLoading }) => isLoading),
        contactOptions: contact.data || [],
        companyOptions: companies?.filter(({ data }) => Boolean(data))?.map(({ data }) => data) || [],
        dealOptions: deals?.filter(({ data }) => Boolean(data)).map(({ data }) => data) || [],
        callDispositionOptions: callDispositions.data || [],
        callDirectionOptions: callDirections.data || [],
    };
};

export { useLoadActivityDeps };
