import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { NumberField } from "./NumberField";
import { TextAreaField } from "./TextAreaField";
import { DatePickerField } from "./DatePickerField";
import { MultipleCheckboxesField } from "./MultipleCheckboxesField";
import type { FieldsMap } from "../common/Builder";

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
} as const as FieldsMap;

export {
    TextField,
    SelectField,
    TextAreaField,
    DatePickerField,
    MultipleCheckboxesField,
};
