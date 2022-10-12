import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { AccountInto } from "./types";

const getAccountInfoService = (client: IDeskproClient) => {
    return baseRequest<AccountInto>(client, {
        url: `/account-info/v3/details`,
    });
};

export { getAccountInfoService };
