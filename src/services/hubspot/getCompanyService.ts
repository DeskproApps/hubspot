import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Company } from "./types";

const getCompanyService = (client: IDeskproClient, companyId: Company["id"]) => {
    return baseRequest<Company>(client, {
        url: `/crm/v3/objects/companies/${companyId}`,
    });
};

export { getCompanyService };
