import type {
    Deal,
    Owner,
    Contact,
    Company,
    Pipeline,
    DealTypes,
    AccountInto,
} from "../../services/hubspot/types";

export type Props = {
    deal: Deal["properties"],
    pipeline: Pipeline,
    accountInfo?: AccountInto,
    owner?: Owner,
    dealTypes?: DealTypes,
    contacts?: Array<Contact["properties"]>,
    companies?: Array<Company["properties"]>,
};
