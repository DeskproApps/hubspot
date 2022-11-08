import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { CallDispositions } from "./types";

const getActivityCallDispositionsServices = (client: IDeskproClient) => {
    return baseRequest<CallDispositions[]>(client, {
        url: "/calling/v1/dispositions",
    });
};

export { getActivityCallDispositionsServices };
