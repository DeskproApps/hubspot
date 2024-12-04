import type { ContactLayout, DealLayout } from "./types";

export const nbsp = "\u00A0";

export const DEFAULT_ERROR = "There was an error!";

export const LOCALE = "en-GB";

export const TABS = {
    HOME: 0,
    VIEW: 1,
} as const;

export const DndTypes = {
    CONTACT: "contact",
} as const;

export const STRUCTURE = {
    CONTACT: {
        home: [
            ["firstname", "lastname"],
            ["jobtitle"],
            ["email"],
            ["phone"],
            ["hubspot_owner_id"],
            ["lifecyclestage"],
        ],
        view: [
            ["firstname", "lastname"],
            ["jobtitle"],
            ["email"],
            ["phone"],
            ["hubspot_owner_id"],
            ["lifecyclestage"],
        ],
    } as ContactLayout,
    DEAL: {
        list: [
            ["dealname"],
            ["dealstage", "amount"],
            ["hubspot_owner_id", "closedate"],
        ],
        view: [
            ["dealname"],
            ["dealtype"],
            ["pipeline"],
            ["dealstage"],
            ["amount"],
            ["closedate"],
            ["hubspot_owner_id"],
            ["hs_priority"],
        ],
    } as DealLayout,
} as const;
