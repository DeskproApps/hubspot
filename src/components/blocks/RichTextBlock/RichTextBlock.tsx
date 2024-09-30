import { DPNormalize } from "../../common";
import type { FC } from "react";
import type { BlockProps } from "../../common/Builder";

type Props = BlockProps<string>;

const RichTextBlock: FC<Props> = ({ value }) => {
    return (
        <DPNormalize text={value}/>
    );
};

export { RichTextBlock };
