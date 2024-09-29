import { useMemo } from "react";
import { P5, Toggle } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { PropertyMeta } from "../../../services/hubspot/types";

type Props = {
    meta: PropertyMeta;
    value: string;
};

const BooleanBlock: FC<Props> = ({ meta, value }) => {
    const selected = useMemo(() => {
        return (meta.options ?? []).find((o) => o.value === value);
    }, [value, meta.options]);

    return selected
        ? (
            <Toggle
                checked={selected?.value === "true"}
                onChange={(() => {})}
                label={selected?.label ?? value}
            />
        )
        : (
            <P5>{value}</P5>
        );
};

export { BooleanBlock };
