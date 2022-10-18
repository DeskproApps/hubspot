import { ReactElement } from "react";
import { Owner, Pipeline, LeadStatusOption } from "../../services/hubspot/types";

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

export type Props = {
    isEditMode?: boolean,
    onSubmit: (values: Values) => void,
    onCancel: () => void,
    owners: Owner[],
    lifecycleStages: Pipeline["stages"],
    leadStatuses: LeadStatusOption[],
};
