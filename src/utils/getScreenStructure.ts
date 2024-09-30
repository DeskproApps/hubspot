import { match } from "ts-pattern";
import { STRUCTURE } from "../constants";
import type { Settings } from "../types";
import type { Layout } from "../components/common/Builder/types";

const getScreenStructure = (
    settings: Settings | undefined,
    object?: "contact"|"deal",
    screen?: "home"|"list"|"view",
): Layout => {
    return match([object, screen])
        .with(["contact", "home"], () => settings?.mapping_contact
            ? JSON.parse(settings.mapping_contact)
            : STRUCTURE.CONTACT
        )
        .otherwise(() => []);
};

export { getScreenStructure };
