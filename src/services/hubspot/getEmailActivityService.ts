import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { EmailActivity } from "./types";

const getEmailActivityService = async (client: IDeskproClient, emailId: EmailActivity["id"]) => {
    const properties = await baseRequest<string[]>(client, { url: "/crm/v3/objects/emails/properties" })
    return baseRequest<EmailActivity>(client, {
        url: `/crm/v3/objects/emails/${emailId}`,
        queryParams: {
            properties: properties.join(",")
        }
    })
};

export { getEmailActivityService };
