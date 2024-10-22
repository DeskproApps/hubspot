import { STRUCTURE } from "../constants";
import type { Settings, ContactLayout, DealLayout } from "../types";
import type { Layout } from "../components/common/Builder";

function getScreenStructure (settings: Settings|undefined, object: "contact", screen: "view"): Layout;
function getScreenStructure (settings: Settings|undefined, object: "contact", screen: "home"): Layout;
function getScreenStructure (settings: Settings|undefined, object: "deal", screen: "list"): Layout;
function getScreenStructure (settings: Settings|undefined, object: "deal", screen: "view"): Layout;
function getScreenStructure (settings: Settings|undefined, object: "contact"|"deal", screen: "home"|"list"|"view"): Layout {
    if (object === "contact" && screen === "home") {
        return settings?.mapping_contact
            ? (JSON.parse(settings.mapping_contact) as ContactLayout).home
            : STRUCTURE.CONTACT.home;
    } else if (object === "contact" && screen === "view") {
        return settings?.mapping_contact
            ? (JSON.parse(settings.mapping_contact) as ContactLayout).view
            : STRUCTURE.CONTACT.view
    } else if (object === "deal" && screen === "list") {
        return settings?.mapping_deal
            ? (JSON.parse(settings.mapping_deal) as DealLayout).list
            : STRUCTURE.DEAL.list
    }
    
    return [];
};

export { getScreenStructure };
