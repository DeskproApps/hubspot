import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Contact } from "./types";

const properties = [
    "hubspot_owner_id",
    "email",
    "phone",
    "jobtitle",
    "lastname",
    "firstname",
    "lifecyclestage",
];

const getContactService = (
    client: IDeskproClient,
    contactId: Contact["id"],
) => {
    return baseRequest<Contact>(client, {
        url: `/crm/v3/objects/contacts/${contactId}`,
        queryParams: {
            properties: properties.join(",")
        }
    });
};

export { getContactService };
