import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { CallActivity } from "./types";

const createActivityCallService = (
    client: IDeskproClient,
    data: Record<string, string>,
) => {
    return baseRequest<CallActivity>(client, {
        url: "/crm/v3/objects/calls",
        method: "POST",
        data: {
            properties: data,
        },
    });
};

export { createActivityCallService };
