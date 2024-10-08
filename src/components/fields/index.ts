import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { NumberField } from "./NumberField";
import { TextAreaField } from "./TextAreaField";
import { DatePickerField } from "./DatePickerField";
import { MultipleCheckboxesField } from "./MultipleCheckboxesField";
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as Record<PropertyMeta["fieldType"], any>;

export {
    TextField,
    SelectField,
    TextAreaField,
    DatePickerField,
    MultipleCheckboxesField,
};
