import { P5 } from "@deskpro/deskpro-ui";
import { Member } from "@deskpro/app-sdk";
import { getFullName } from "../../../utils";
import { useSelectBlock } from "./hooks";
import type { FC } from "react";
import type { BlockProps } from "../../common/Builder";

type Props = BlockProps<string>;

const SelectBlock: FC<Props> = ({ meta, value }) => {
    const { isOwner, owner, displayValue } = useSelectBlock(meta, value);

    return (isOwner && owner)
        ? <Member name={getFullName(owner)} />
        : <P5>{displayValue || "-"}</P5>;
};

export { SelectBlock };
