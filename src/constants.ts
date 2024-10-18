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
            ["jobtitle"],
            ["email"],
            ["phone"],
            ["hubspot_owner_id"],
            ["lifecyclestage"],
        ],
        view: [
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
            ["amount", "dealstage"],
            ["hubspot_owner_id", "closedate"],
        ],
        view: [
            ["dealname"],
            ["amount", "dealstage"],
            ["createdate", "closedate"],
            ["hs_priority", "dealtype"],
            ["hubspot_owner_id"]
        ],
    } as DealLayout,
} as const;
