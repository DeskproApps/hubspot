import { baseRequest } from "./baseRequest";
import { PROPERTIES } from "./constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { EmailActivity } from "./types";

const getEmailActivityService = (client: IDeskproClient, emailId: EmailActivity["id"]) => {
    return baseRequest<EmailActivity>(client, {
        url: `/crm/v3/objects/emails/${emailId}`,
        queryParams: {
            properties: PROPERTIES.emails.join(",")
        }
    })
};

export { getEmailActivityService };
