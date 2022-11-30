import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { PROPERTIES } from "./constants";
import type { Deal } from "./types";

const getDealService = (client: IDeskproClient, dealId: Deal["id"]) => {
    return baseRequest<Deal>(client, {
        url: `/crm/v3/objects/deals/${dealId}`,
        entity: "deal",
        queryParams: {
            properties: PROPERTIES.deals.join(",")
        }
    });
};

export { getDealService };
