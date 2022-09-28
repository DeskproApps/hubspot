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
};

const searchContactsByService = (
    client: IDeskproClient,
    q: string,
) => {
    return searchContactsService(client, {
        filterGroups: [{
            filters: [{
                propertyName: "email",
                operator: "CONTAINS_TOKEN",
                value: `*${q}*`,
            }],
        }, {
            filters: [{
                propertyName: "firstname",
                operator: "CONTAINS_TOKEN",
                value: `*${q}*`,
            }],
        }, {
            filters: [{
                propertyName: "lastname",
                operator: "CONTAINS_TOKEN",
                value: `*${q}*`,
            }],
        }],
    })
}

export {
    searchContactsService,
    searchContactsByService,
    getContactsByEmailService,
};
