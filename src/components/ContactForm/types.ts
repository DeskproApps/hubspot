import { ReactElement } from "react";
import { Owner, Pipeline, LeadStatusOption, Contact } from "../../services/hubspot/types";

export type Option<Value> = {
    value: Value,
    key: Value,
    label: string | ReactElement,
    type: "value",
    disabled?: boolean,
    selected?: boolean,
};

export type Values = {
    email: string,
    firstName: string,
    lastName: string,
    owner: Option<Owner["id"]>,
    jobTitle: string,
    phone: string,
    lifecycleStage: Option<string>,
    leadStatus: Option<string>,
};

export type FormErrors = Record<keyof Values, string>;

export type Props = {
    initValues?: InitValues,
    isEditMode?: boolean,
    onSubmit: (values: Values) => void,
    onCancel?: () => void,
    owners: Owner[],
    lifecycleStages: Pipeline["stages"],
    leadStatuses: LeadStatusOption[],
    formErrors: FormErrors | null,
};

export type InitValues = {
    email?: Contact["properties"]["email"],
    firstName?: Contact["properties"]["firstname"],
    lastName?: Contact["properties"]["lastname"],
    jobTitle?: Contact["properties"]["jobtitle"],
    phone?: Contact["properties"]["phone"],
    ownerId?: Contact["properties"]["hubspot_owner_id"],
    lifecycleStage?: Contact["properties"]["lifecyclestage"],
};

export type InitValuesParams = Partial<Pick<Props, "owners"|"lifecycleStages">>;
