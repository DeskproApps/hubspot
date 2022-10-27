import type {
    Owner,
    Contact,
    Company,
    Pipeline,
    DealTypeOption,
    DealPriorityOption,
} from "../../services/hubspot/types";
import type { Option } from "../../types";

export type Values = {
    name: string,
    pipeline: Option<string>,
    dealStage: Option<string>,
    amount: string,
    closeDate: string,
    dealOwner: Option<string>,
    dealType: Option<string>,
    priority: Option<string>,
    contact: Option<string>,
    company: Option<string>,
};

export type InitValues = {
    //...
};

export type InitValuesParams = {
    pipelines?: Pipeline[],
};

export type Props = {
    isEditMode?: boolean,
    initValues: InitValues,
    onSubmit: (values: Values) => void,
    onCancel: () => void,
    pipelines: Pipeline[],
    currency: string,
    ownerOptions: Array<Option<Owner["id"]>>,
    dealTypeOptions: Array<Option<DealTypeOption["value"]>>,
    priorityOptions: Array<Option<DealPriorityOption["value"]>>,
    contactOptions: Array<Option<Contact["id"]>>,
    companyOptions: Array<Option<Company["id"]>>,
};
