import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";

const getPropertyService = <T>(
    client: IDeskproClient,
    type: "contacts"|"deals",
    propertyName: string,
): Promise<T> => {
    return baseRequest(client, {
        url: `/crm/v3/properties/${type}/${propertyName}`,
    });
};

export { getPropertyService };
