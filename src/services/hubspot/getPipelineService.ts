import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Pipeline, PipelineTypes } from "./types";

const getPipelineService = (
    client: IDeskproClient,
    type: PipelineTypes,
    pipelineId: Pipeline["id"],
): Promise<Pipeline> => {
    return baseRequest(client, {
        url: `/crm/v3/pipelines/${type}/${pipelineId}`,
    });
};

export { getPipelineService };
