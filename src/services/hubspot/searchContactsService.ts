import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import type { Contacts } from "./types";

const searchContactsService = (
    client: IDeskproClient,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
) => {
    return baseRequest<Contacts>(client, {
        url: "/crm/v3/objects/contacts/search",
        method: "POST",
        data
    });
};

const searchContactsByEmailService = (
    client: IDeskproClient,
    q: string,
) => {
    return searchContactsService(client, {
        filterGroups: [
            {
                filters: [
                    {
                        propertyName: "email",
                        operator: "CONTAINS_TOKEN",
                        value: q,
                    }
                ]
            }
        ]
    })
}

const getContactsByEmailService = (
    client: IDeskproClient,
    email: string,
) => {
    return searchContactsService(client, {
        filterGroups: [
            {
                filters: [
                    {
                        propertyName: "email",
                        operator: "EQ",
                        value: email,
                    }
                ]
            }
        ]
    })
}

export {
    searchContactsService,
    getContactsByEmailService,
    searchContactsByEmailService,
};
