import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Deal } from "./types";

const properties = [
    "hs_object_id",
    "hubspot_owner_id",
    "amount",
    "dealname",
    "pipeline",
    "dealstage",
    "closedate",
    "dealtype",
    "hs_priority",
];

const getDealService = (client: IDeskproClient, dealId: Deal["id"]) => {
    return baseRequest<Deal>(client, {
        url: `/crm/v3/objects/deals/${dealId}`,
        entity: "deal",
        queryParams: {
            properties: properties.join(",")
        }
    });
};

export { getDealService };
