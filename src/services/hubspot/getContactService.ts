import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Contact } from "./types";

const getContactService = (
    client: IDeskproClient,
    contactId: Contact["id"],
): Promise<Contact> => {
    return baseRequest(client, {
        url: `/crm/v3/objects/contacts/${contactId}`,
    });
};

export { getContactService };
