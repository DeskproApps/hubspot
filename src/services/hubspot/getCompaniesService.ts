import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Companies } from "./types";

const getCompaniesService = (client: IDeskproClient) => {
    return baseRequest<Companies>(client, {
        url: `/crm/v3/objects/companies`,
        entity: "companies"
    });
};

export { getCompaniesService };
