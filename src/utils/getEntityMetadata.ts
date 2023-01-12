import get from "lodash/get";
import { getFullName } from "./getFullName";
import type { Company, Deal, Contact, EntityMetadata } from "../services/hubspot/types";

const getEntityMetadata = ({ contact, companies, deals }: {
    contact?: Contact["properties"],
    companies?: Array<Company["properties"]>,
    deals?: Array<Deal["properties"]>,
}): EntityMetadata => ({
    id: get(contact, ["hs_object_id"], ""),
    fullName: getFullName({
        firstName: get(contact, ["firstname"]),
        lastName: get(contact, ["lastname"]),
    }),
    phone: get(contact, ["phone"], "") || "",
    email: get(contact, ["email"], "") || "",
    companies: (companies || []).map(({ hs_object_id, name }) => ({ id: hs_object_id, name })),
    deals: (deals || []).map(({ hs_object_id, dealname }) => ({ id: hs_object_id, name: dealname })),
});

export { getEntityMetadata };
