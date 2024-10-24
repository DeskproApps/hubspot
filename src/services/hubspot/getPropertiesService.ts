import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { RequestParams } from "../../types";

const getPropertiesService = (
    client: IDeskproClient,
    entity: "contacts"|"deals",
    params: Partial<RequestParams>,
): Promise<string[]> => {
    return baseRequest(client, {
        url: `/crm/v3/objects/${entity}/properties`,
        ...params,
    });
};

export { getPropertiesService };
