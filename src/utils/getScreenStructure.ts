import { STRUCTURE } from "../constants";
import type { Settings, ContactLayout } from "../types";
import type { Layout } from "../components/common/Builder";

function getScreenStructure (settings: Settings | undefined, object: "contact", screen: "home"|"list"|"view"): Layout;
function getScreenStructure (settings: Settings | undefined, object: "deal", screen: "home"|"list"|"view"): Layout;
function getScreenStructure (settings: Settings | undefined, object: "contact"|"deal", screen: "home"|"list"|"view"): Layout {
    if (object === "contact" && screen === "home") {
        return settings?.mapping_contact
            ? (JSON.parse(settings.mapping_contact) as ContactLayout).home
            : STRUCTURE.CONTACT.home;
    } else if (object === "contact" && screen === "view") {
        return settings?.mapping_contact
            ? (JSON.parse(settings.mapping_contact) as ContactLayout).view
            : STRUCTURE.CONTACT.view
    }
    
    return [];
};

export { getScreenStructure };
