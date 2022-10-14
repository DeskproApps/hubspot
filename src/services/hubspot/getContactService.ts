import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Contact } from "./types";

const getContactService = async (
    client: IDeskproClient,
    contactId: Contact["id"],
) => {
    const properties = await baseRequest<string[]>(client, { url: "/crm/v3/objects/contacts/properties" })
    return baseRequest<Contact>(client, {
        url: `/crm/v3/objects/contacts/${contactId}`,
        queryParams: {
            properties: properties.join(",")
        }
    });
};

export { getContactService };
