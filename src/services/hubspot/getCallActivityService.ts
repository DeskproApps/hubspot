import { baseRequest } from "./baseRequest";
import { PROPERTIES } from "./constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { CallActivity } from "./types";

const getCallActivityService = (client: IDeskproClient, callId: CallActivity["id"]) => {
    return baseRequest<CallActivity>(client, {
        url: `/crm/v3/objects/calls/${callId}`,
        queryParams: {
            properties: PROPERTIES.calls.join(",")
        }
    })
};

export { getCallActivityService };
