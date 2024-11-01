import { TextField } from "./TextField";
import { RadioField } from "./RadioField";
import { SelectField } from "./SelectField";
import { NumberField } from "./NumberField";
import { TextAreaField } from "./TextAreaField";
import { DatePickerField } from "./DatePickerField";
import { MultipleCheckboxesField } from "./MultipleCheckboxesField";

export const fieldsMap = {
    text: TextField,
    number: NumberField,
    textarea: TextAreaField,
    html: TextAreaField,
    phonenumber: TextField,
    date: DatePickerField,
    select: SelectField,
    booleancheckbox: SelectField,
    radio: RadioField,
    checkbox: MultipleCheckboxesField,
} as const;

export {
    TextField,
    RadioField,
    SelectField,
    TextAreaField,
    DatePickerField,
    MultipleCheckboxesField,
};
