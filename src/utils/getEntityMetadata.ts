import { getFullName } from "./getFullName";
import type { EntityMetadata } from "../types";
import type { Company, Deal, Contact } from "../services/hubspot/types";

const getEntityMetadata = ({ contact, companies, deals }: {
    contact?: Contact["properties"],
    companies?: Array<Company["properties"]>,
    deals?: Array<Deal["properties"]>,
}): EntityMetadata => ({
    id: contact?.hs_object_id || "",
    fullName: getFullName(contact) || "",
    phone: contact?.phone || "",
    email: contact?.email || "",
    companies: (companies || []).map(({ hs_object_id, name }) => ({ id: hs_object_id, name })),
    deals: (deals || []).map(({ hs_object_id, dealname }) => ({ id: hs_object_id, name: dealname })),
});

export { getEntityMetadata };
