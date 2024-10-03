import { STRUCTURE } from "../constants";
import type { Settings } from "../types";
import type { Layout } from "../components/common/Builder/types";

const getScreenStructure = (
    settings: Settings | undefined,
    object?: "contact"|"deal",
    screen?: "home"|"list"|"view",
): Layout => {
    if (object === "contact" && screen === "home") {
        return settings?.mapping_contact
            ? JSON.parse(settings.mapping_contact).home
            : STRUCTURE.CONTACT.home;
    } else if (object === "contact" && screen === "view") {
        return settings?.mapping_contact
            ? JSON.parse(settings.mapping_contact).view
            : STRUCTURE.CONTACT.view
    } else {
        return [];
    }
};

export { getScreenStructure };
