import { P5 } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { BlockProps } from "../../common/Builder";

type Props = BlockProps<string>;

const TextBlock: FC<Props> = ({ value }) => {
    return (
        <P5>{value || "-"}</P5>
    );
};

export { TextBlock };
