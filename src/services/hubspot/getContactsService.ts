import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Contacts } from "./types";

const getContactsService = (client: IDeskproClient) => {
    return baseRequest<Contacts>(client, {
        url: `/crm/v3/objects/contacts`,
        entity: "contacts",
    });
};

export { getContactsService };
