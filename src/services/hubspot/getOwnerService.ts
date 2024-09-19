import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Owner } from "./types";

const getOwnerService = (client: IDeskproClient, ownerId: Owner["id"]) => {
    return baseRequest<Owner>(client, {
        url: `/crm/v3/owners/${ownerId}`,
    });
};

export { getOwnerService };
