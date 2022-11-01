import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Contact } from "./types";

const updateContactService = (
    client: IDeskproClient,
    contactId: Contact["id"],
    data: Record<string, string>
) => {
    return baseRequest<Contact>(client, {
        url: `/crm/v3/objects/contacts/${contactId}`,
        method: "PATCH",
        data: {
            properties: data,
        },
    });
};

export { updateContactService };
