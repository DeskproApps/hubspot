import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Deal } from "./types";

const createDealService = (
    client: IDeskproClient,
    data: Record<string, string>,
) => {
    return baseRequest<Deal>(client, {
        url: `/crm/v3/objects/deals`,
        method: "POST",
        entity: "deal",
        data: {
            properties: data,
        }
    });
};

export { createDealService };
