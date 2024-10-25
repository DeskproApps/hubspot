import { TextBlock } from "./TextBlock";
import { NumberBlock } from "./NumberBlock";
import { SelectBlock } from "./SelectBlock";
import { RichTextBlock } from "./RichTextBlock";
import { DatePickerBlock } from "./DatePickerBlock";
import { MultipleCheckboxesBlock } from "./MultipleCheckboxesBlock";
import { BooleanBlock } from "./BooleanBlock";

export const blocksMap = {
    text: TextBlock,
    phonenumber: TextBlock,
    radio: TextBlock,
    html: RichTextBlock,
    textarea: RichTextBlock,
    number: NumberBlock,
    date: DatePickerBlock,
    checkbox: MultipleCheckboxesBlock,
    select: SelectBlock,
    booleancheckbox: BooleanBlock,
} as const;

export {
    TextBlock,
    NumberBlock,
    SelectBlock,
    BooleanBlock,
    RichTextBlock,
    DatePickerBlock,
    MultipleCheckboxesBlock,
};
