import { P5 } from "@deskpro/deskpro-ui";
import { format } from "../../../utils/date";
import type { FC } from "react";
import type { PropertyMeta } from "../../../services/hubspot/types";

type Props = {
    meta: PropertyMeta;
    value: string;
};

const DatePickerBlock: FC<Props> = ({ meta, value }) => {
    const date = format(value, { time: meta.type === "datetime" });

    return (
        <P5>{date}</P5>
    );
};

export { DatePickerBlock };
