import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { EmailActivity } from "./types";

const createActivityEmailService = (
    client: IDeskproClient,
    data: Record<string, string>,
) => {
    return baseRequest<EmailActivity>(client, {
        url: "/crm/v3/objects/emails",
        method: "POST",
        data: {
            properties: data,
        },
    });
};

export { createActivityEmailService };
