import { baseRequest } from "./baseRequest";
import { PROPERTIES } from "./constants";
import type { IDeskproClient } from "@deskpro/app-sdk";

const getAssocEntitiesByContactId = (
    client: IDeskproClient,
    entity: keyof typeof PROPERTIES,
    contactId: string,
) => {
    return baseRequest(client, {
        url: `/crm/v3/objects/${entity}/search`,
        method: "POST",
        data: {
            filters: [{
                propertyName: "associations.contact",
                operator: "EQ",
                value: contactId,
            }],
            properties: PROPERTIES[entity],
        },
    });
};

const getDealsByContactId = (
    client: IDeskproClient,
    contactId: string,
) => {
    return getAssocEntitiesByContactId(client, "deals", contactId);
};

const getNotesByContactId = (
    client: IDeskproClient,
    contactId: string,
) => {
    return getAssocEntitiesByContactId(client, "notes", contactId);
};

const getCallsByContactId = (
    client: IDeskproClient,
    contactId: string,
) => {
    return getAssocEntitiesByContactId(client, "calls", contactId);
};

const getEmailsByContactId = (
    client: IDeskproClient,
    contactId: string,
) => {
    return getAssocEntitiesByContactId(client, "emails", contactId);
};

export { getDealsByContactId, getNotesByContactId, getCallsByContactId, getEmailsByContactId };
