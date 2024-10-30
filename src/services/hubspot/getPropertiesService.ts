import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { RequestParams } from "../../types";

const getPropertiesService = (
    client: IDeskproClient,
    type: "contacts",
    params: Partial<RequestParams>,
): Promise<string[]> => {
    return baseRequest(client, {
        url: `/crm/v3/objects/${type}/properties`,
        ...params,
    });
};

export { getPropertiesService };
