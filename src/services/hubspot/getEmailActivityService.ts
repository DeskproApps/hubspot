import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { EmailActivity } from "./types";

const properties = [
    "hs_object_id",
    "hs_email_html",
    "hs_timestamp",
    "hs_email_text",
    "hs_email_subject",
    "hs_email_from_firstname",
    "hs_email_from_lastname",
    "hs_email_to_firstname",
    "hs_email_to_lastname",
    "hubspot_owner_id",
];

const getEmailActivityService = (client: IDeskproClient, emailId: EmailActivity["id"]) => {
    return baseRequest<EmailActivity>(client, {
        url: `/crm/v3/objects/emails/${emailId}`,
        queryParams: {
            properties: properties.join(",")
        }
    })
};

export { getEmailActivityService };
