import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CallActivities } from "./types";

const getCallActivityService = async (client: IDeskproClient, callId: CallActivities["id"]) => {
    const properties = await baseRequest<string[]>(client, { url: "/crm/v3/objects/calls/properties" })
    return baseRequest(client, {
        url: `/crm/v3/objects/calls/${callId}`,
        queryParams: {
            properties: properties.join(",")
        }
    })
};

export { getCallActivityService };
