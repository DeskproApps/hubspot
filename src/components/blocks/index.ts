import { TextBlock } from "./TextBlock";
import { NumberBlock } from "./NumberBlock";
import { RichTextBlock } from "./RichTextBlock";
import { DatePickerBlock } from "./DatePickerBlock";

export const blocksMap = {
    text: TextBlock,
    phonenumber: TextBlock,
    html: RichTextBlock,
    textarea: RichTextBlock,
    number: NumberBlock,
    date: DatePickerBlock,
};

export { TextBlock } from "./TextBlock";
