import { Option } from "../../types";

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

export type FormErrors = Record<keyof Values, string>;

export type InitValues = {
    //...
};

export type InitValuesParams = {
    //...
};

export type Props = {
    isEditMode?: boolean,
    initValues: InitValues,
    onSubmit: (values: Values) => void,
    onCancel: () => void,
};
