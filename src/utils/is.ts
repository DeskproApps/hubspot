import type { Contact, Owner } from "../services/hubspot/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isString = (value: any): value is string => {
    return typeof value === "string";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNumber = (value: any): value is number => {
    return typeof value === "number" && !isNaN(value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPrimitive = (value: any): value is string | number => {
    return isString(value) || isNumber(value);
};

export const isEmptyObject = (obj: object): boolean => {
    return obj == null || (Object.keys(obj).length === 0 && obj.constructor === Object);
};

export const isContact = (
    contact: Contact["properties"] | Owner
): contact is Contact["properties"] => {
    return "firstname" in contact && "lastname" in contact;
};

export const isOwner = (
    owner: Contact["properties"] | Owner
): owner is Owner => {
    return "firstName" in owner && "lastName" in owner;
};
