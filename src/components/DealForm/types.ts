import type {
    Deal,
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
    closeDate: string|Date,
    dealOwner: Option<string>,
    dealType: Option<string>,
    priority: Option<string>,
    contact: Option<string>,
    company: Option<string>,
};

export type InitValues = Partial<{
    name: Deal["properties"]["dealname"],
    amount: Deal["properties"]["amount"],
    pipelineId: Deal["properties"]["pipeline"],
    dealStageId: Deal["properties"]["dealstage"],
    closeDate: Deal["properties"]["closedate"],
    ownerId: Deal["properties"]["hubspot_owner_id"],
    dealTypeId: Deal["properties"]["dealtype"],
    priorityId: Deal["properties"]["hs_priority"],
    contactId: Contact["id"],
    companyId: Company["id"],
}>;

export type InitValuesParams = {
    pipelines?: Pipeline[],
    ownerOptions?: Array<Option<Owner["id"]>>,
    contactOptions?: Array<Option<Contact["id"]>>,
    companyOptions?: Array<Option<Company["id"]>>,
    dealTypeOptions?: Array<Option<DealTypeOption["value"]>>,
    priorityOptions?: Array<Option<DealPriorityOption["value"]>>,
};

export type Props = {
    isEditMode?: boolean,
    initValues: InitValues,
    onSubmit: (values: Values) => Promise<void>,
    onCancel: () => void,
    pipelines: Pipeline[],
    currency: string,
    ownerOptions: Array<Option<Owner["id"]>>,
    dealTypeOptions: Array<Option<DealTypeOption["value"]>>,
    priorityOptions: Array<Option<DealPriorityOption["value"]>>,
    contactOptions?: Array<Option<Contact["id"]>>,
    companyOptions?: Array<Option<Company["id"]>>,
};
