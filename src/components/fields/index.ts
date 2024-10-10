import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { NumberField } from "./NumberField";
import { TextAreaField } from "./TextAreaField";
import { DatePickerField } from "./DatePickerField";
import { MultipleCheckboxesField } from "./MultipleCheckboxesField";
import type { FC } from "react";
import type { FieldProps } from "../common/Builder";
import type { PropertyMeta } from "../../services/hubspot/types";

export const fieldsMap = {
    text: TextField,
    number: NumberField,
    textarea: TextAreaField,
    html: TextAreaField,
    phonenumber: TextField,
    date: DatePickerField,
    select: SelectField,
    booleancheckbox: SelectField,
    radio: SelectField,
    checkbox: MultipleCheckboxesField,
} as Record<PropertyMeta["fieldType"], FC<FieldProps>>;

export {
    TextField,
    SelectField,
    TextAreaField,
    DatePickerField,
    MultipleCheckboxesField,
};
