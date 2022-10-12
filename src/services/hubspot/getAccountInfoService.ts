import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import {} from "./types";

const getAccountInfoService = (client: IDeskproClient) => {
    return baseRequest(client, {
        url: `/account-info/v3/details`,
    });
};

export { getAccountInfoService };
