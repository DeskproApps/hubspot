import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { DealTypes } from "./types";

const getDealTypesService = (client: IDeskproClient) => {
    return baseRequest<DealTypes>(client, { url: "/crm/v3/properties/deals/dealtype" });
};

export { getDealTypesService };
