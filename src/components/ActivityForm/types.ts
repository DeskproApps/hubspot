import type {
    Deal,
    Company,
    Contact,
    CallDispositions,
    CallDirectionOption,
} from "../../services/hubspot/types";
import type { Option } from "../../types";

export type Values = {
    activityType: Option<string>,
    description: string,
    timestamp: string|Date,
    contacted: Option<Contact["id"]>,
    callDisposition: Option<CallDispositions["id"]>,
    callDirection: Option<CallDirectionOption["value"]>,
    associateContact: Option<Contact["id"]>,
    associateCompany: Option<Company["id"]>,
    associateDeal: Option<Deal["id"]>,
};

export type InitValues = {
    contactId: Contact["id"],
};

export type InitValuesParams = {
    contactOptions?: Array<Option<Contact["id"]>>,
};

export type Props = {
    initValues: InitValues,
    onSubmit: (values: Values) => void,
    onCancel: () => void,
    contactOptions: Array<Option<Contact["id"]>>,
    companyOptions: Array<Option<Company["id"]>>,
    dealOptions: Array<Option<Deal["id"]>>,
    callDispositionOptions: Array<Option<CallDispositions["id"]>>,
    callDirectionOptions: Array<Option<CallDirectionOption["value"]>>,
};
