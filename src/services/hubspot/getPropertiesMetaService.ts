import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { PropertyMeta } from "./types";

const getPropertiesMetaService = (
    client: IDeskproClient,
    type: "contacts",
) => {
    return baseRequest<{ results: PropertyMeta[] }>(client, {
        url: `/crm/v3/properties/${type}`,
    });
};

export { getPropertiesMetaService };
