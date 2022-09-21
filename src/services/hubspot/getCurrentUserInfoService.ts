import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";

type Error = {
    category: "INVALID_AUTHENTICATION"
    correlationId: string,
    message: string,
    status: "error"
};

const getCurrentUserInfoService = (client: IDeskproClient) => {
    return baseRequest<Error>(client, { url: "/account-info/v3/details" });
};

export { getCurrentUserInfoService };
