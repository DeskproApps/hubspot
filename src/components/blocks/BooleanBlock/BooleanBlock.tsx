import { useMemo } from "react";
import { P5, Toggle } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { BlockProps } from "../../common/Builder";

type Props = BlockProps<"true"|"false">;

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
