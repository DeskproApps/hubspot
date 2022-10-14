import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Deal } from "./types";

const getDealService = async (client: IDeskproClient, dealId: Deal["id"]) => {
    const properties = await baseRequest<string[]>(client, { url: "/crm/v3/objects/deals/properties" })
    return baseRequest<Deal>(client, {
        url: `/crm/v3/objects/deals/${dealId}`,
        queryParams: {
            properties: properties.join(",")
        }
    });
};

export { getDealService };
