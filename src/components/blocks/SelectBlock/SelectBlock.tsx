import { useMemo } from "react";
import { P5 } from "@deskpro/deskpro-ui";
import { Member } from "@deskpro/app-sdk";
import { useQueryWithClient } from "../../../hooks";
import { getFullName } from "../../../utils";
import { getOwnersService } from "../../../services/hubspot";
import { QueryKey } from "../../../query";
import type { FC } from "react";
import type { BlockProps } from "../../common/Builder";

type Props = BlockProps<string>;

const SelectBlock: FC<Props> = ({ meta, value }) => {
    const isOwner = meta.referencedObjectType === "OWNER"; 

    const owners = useQueryWithClient(
        [QueryKey.OWNERS],
        getOwnersService,
        { enabled: isOwner },
    );

    const owner = useMemo(() => {
        return (owners.data?.results ?? []).find(({ id }) => id === value);
    }, [value, owners.data]);

    return (isOwner && owner)
        ? (
            <Member name={getFullName(owner)} />
        )
        : (
            <P5>{value || "-"}</P5>
        );
};

export { SelectBlock };
