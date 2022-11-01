import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Owner } from "./types";

const getOwnersService = (client: IDeskproClient) => {
    return baseRequest<{ results: Owner[] }>(client, {
        url: `/crm/v3/owners`
    });
};

export { getOwnersService };
