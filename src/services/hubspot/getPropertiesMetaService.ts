import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { RequestParams } from "../../types";
import type { PropertyMeta } from "./types";

const getPropertiesMetaService = (
    client: IDeskproClient,
    type: "contacts",
    params?: Partial<RequestParams>,
) => {
    return baseRequest<{ results: PropertyMeta[] }>(client, {
        url: `/crm/v3/properties/${type}`,
        ...(params ?? {}),
    });
};

export { getPropertiesMetaService };
