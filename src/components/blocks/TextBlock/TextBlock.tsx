import { P5 } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { PropertyMeta } from "../../../services/hubspot/types";

type Props = {
    meta: PropertyMeta;
    value: string;
};

const TextBlock: FC<Props> = ({ value }) => {
    return (
        <P5>{value || "-"}</P5>
    );
};

export { TextBlock };
