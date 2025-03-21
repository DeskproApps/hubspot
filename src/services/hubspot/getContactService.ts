import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { PROPERTIES } from "./constants";
import type { Contact } from "./types";

const getContactService = (
    client: IDeskproClient,
    contactId: Contact["id"],
    properties?: string[],
) => {
    return baseRequest<Contact>(client, {
        url: `/crm/v3/objects/contacts/${contactId}`,
        entity: "contact",
        queryParams: {
            properties: [
                ...PROPERTIES.contacts,
                ...(properties ?? []),
            ].join(","),
        }
    });
};

export { getContactService };
