import type { Contact, Owner } from "../services/hubspot/types";

export const isEmptyObject = (obj: object): boolean => {
    return Object.values(obj).length === 0;
};

export const isContact = (
    contact: Partial<Contact["properties"] | Owner>,
): contact is Contact["properties"] => {
    return "firstname" in contact && "lastname" in contact;
};

export const isOwner = (
    owner: Partial<Contact["properties"] | Owner>,
): owner is Owner => {
    return "firstName" in owner && "lastName" in owner;
};
