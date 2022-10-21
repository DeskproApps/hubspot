import get from "lodash/get";
import {
    getOwnersService,
    getContactService,
    getPipelineService,
    getLeadStatusesService,
} from "../services/hubspot";
import { useQueryWithClient } from "./useQueryWithClient";
import { QueryKey } from "../query";
import type { Contact } from "../services/hubspot/types";

const useLoadUpdateContactDeps = (contactId?: Contact["id"]) => {
    const contact = useQueryWithClient(
        [QueryKey.CONTACT, contactId],
        (client) => getContactService(client, contactId as Contact["id"]),
        { enabled: !!contactId },
    );

    const owners = useQueryWithClient(
        [QueryKey.OWNERS],
        getOwnersService,
    );

    const lifecycleStages = useQueryWithClient(
        [QueryKey.PIPELINES, "contacts"],
        (client) => getPipelineService(client, "contacts", "contacts-lifecycle-pipeline"),
    );

    const leadStatuses = useQueryWithClient(
        [QueryKey.PROPERTIES, "contacts", "hs_lead_status"],
        getLeadStatusesService,
    );

    return {
        isLoading: [
            owners,
            leadStatuses,
            lifecycleStages,
            ...(!contactId ? [] : [contact]),
        ].every(({ isLoading }) => Boolean(isLoading)),
        contact: get(contact, ["data", "properties"], null),
        owners: get(owners, ["data", "results"], []) || [],
        lifecycleStages: get(lifecycleStages, ["data", "stages"], []) || [],
        leadStatuses: get(leadStatuses, ["data", "options"]) || [],
    } as const;
};

export { useLoadUpdateContactDeps };
