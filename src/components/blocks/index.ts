import { TextBlock } from "./TextBlock";
import { NumberBlock } from "./NumberBlock";
import { SelectBlock } from "./SelectBlock";
import { RichTextBlock } from "./RichTextBlock";
import { DatePickerBlock } from "./DatePickerBlock";
import { MultipleCheckboxesBlock } from "./MultipleCheckboxesBlock";
import { BooleanBlock } from "./BooleanBlock";
import type { FC } from "react";

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as Record<string, FC<any>>;

export {
    TextBlock,
    NumberBlock,
    SelectBlock,
    BooleanBlock,
    RichTextBlock,
    DatePickerBlock,
    MultipleCheckboxesBlock,
};
