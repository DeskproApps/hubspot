import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Deal } from "./types";

const updateDealService = (
    client: IDeskproClient,
    dealId: Deal["id"],
    data: Record<string, string>
) => {
    return baseRequest<Deal>(client, {
        url: `/crm/v3/objects/deals/${dealId}`,
        method: "PATCH",
        data: {
            properties: data,
        },
    });
};

export { updateDealService };
