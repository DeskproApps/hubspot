import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Contact } from "./types";

const createContactService = (
    client: IDeskproClient,
    data: Record<string, unknown>
) => {
    return baseRequest<Contact>(client, {
        url: "/crm/v3/objects/contacts",
        method: "POST",
        data: {
            properties: data,
        },
    });
};

export { createContactService };
