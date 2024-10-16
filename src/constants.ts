import type { Layout } from "./components/common/Builder";

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
        ] as Layout,
        view: [
            ["jobtitle"],
            ["email"],
            ["phone"],
            ["hubspot_owner_id"],
            ["lifecyclestage"],
        ] as Layout,
    },
} as const;
