import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Pipeline, PipelineTypes } from "./types";

const getPipelinesService = (
    client: IDeskproClient,
    type: PipelineTypes,
): Promise<Pipeline[]> => {
    return baseRequest(client, {
        url: `/crm/v3/pipelines/${type}`,
    });
};

export { getPipelinesService };
