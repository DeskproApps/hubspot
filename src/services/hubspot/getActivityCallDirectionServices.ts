import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { CallDirections } from "./types";

const getActivityCallDirectionServices = (client: IDeskproClient) => {
    return baseRequest<CallDirections>(client, {
        url: "/crm/v3/properties/calls/hs_call_direction",
    });
};

export { getActivityCallDirectionServices };
