import { useMemo } from "react";
import { useQueryWithClient, useQueriesWithClient } from "../../hooks";
import { QueryKey } from "../../query";
import {
    getContactService,
    getEntityAssocService,
    getActivityCallDirectionServices,
    getActivityCallDispositionsServices, getCompanyService, getDealService,
} from "../../services/hubspot";
import { getFullName, getOption } from "../../utils";
import type { Option } from "../../types";
import type {
    Deal,
    Contact,
    Company,
    CallDispositions,
    CallDirectionOption,
} from "../../services/hubspot/types";

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
                    ...getOption(data.id, getFullName(data.properties)),
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
    // ToDo: rewrite to search api (getAssocEntitiesByContactId)
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

    const companyOptions = useMemo(() => {
        return companies?.map(({ data }) => {
            return !data ? null : {
                ...getOption(data.id, data.properties.name),
                selected: true,
            };
        }).filter(Boolean) || [];
    }, [companies]) as Array<Option<Company["id"]>>;

    // ToDo: rewrite to search api (getAssocEntitiesByContactId)
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

    const dealOptions = useMemo(() => {
        return deals?.map(({ data }) => {
            return (data?.id && data?.properties?.dealname)
                ? getOption<Deal["id"]>(data.id, data.properties.dealname)
                : null;
        }).filter(Boolean) || [];
    }, [deals]) as Array<Option<Deal["id"]>>;

    return {
        isLoading: [
            contact,
            callDirections,
            callDispositions,
            ...companies,
        ].every(({ isLoading }) => isLoading),
        contactOptions: contact.data || [],
        companyOptions,
        dealOptions,
        callDispositionOptions: callDispositions.data || [],
        callDirectionOptions: callDirections.data || [],
    };
};

export { useLoadActivityDeps };
