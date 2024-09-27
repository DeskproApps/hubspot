import { DPNormalize } from "../../common";
import type { FC } from "react";
import type { PropertyMeta } from "../../../services/hubspot/types";

type Props = {
    meta: PropertyMeta;
    value: string;
};

const RichTextBlock: FC<Props> = ({ value }) => {
    return (
        <DPNormalize text={value}/>
    );
};

export { RichTextBlock };
