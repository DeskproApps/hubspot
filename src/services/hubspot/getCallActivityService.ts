import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CallActivity } from "./types";

const properties = [
    "hs_object_id",
    "hs_call_body",
    "hs_call_title",
    "hs_timestamp",
    "hs_call_duration",
    "hubspot_owner_id",
];

const getCallActivityService = (client: IDeskproClient, callId: CallActivity["id"]) => {
    return baseRequest<CallActivity>(client, {
        url: `/crm/v3/objects/calls/${callId}`,
        queryParams: {
            properties: properties.join(",")
        }
    })
};

export { getCallActivityService };
