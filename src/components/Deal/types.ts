import type {
    Deal,
    Contact,
    Company,
    AccountInto,
    PropertyMeta,
} from "../../services/hubspot/types";

export type Props = {
    deal: Deal["properties"],
    dealMetaMap: Record<PropertyMeta["name"], PropertyMeta>,
    accountInfo?: AccountInto,
    contacts?: Array<Contact["properties"]>,
    companies?: Array<Company["properties"]>,
};
