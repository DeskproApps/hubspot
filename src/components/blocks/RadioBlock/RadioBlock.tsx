import { useMemo } from "react";
import { P5 } from "@deskpro/deskpro-ui";
import { useQueryWithClient } from "../../../hooks";
import { getPipelinesService } from "../../../services/hubspot";
import { QueryKey } from "../../../query";
import { flatten } from "../../../utils";
import { useBlocksBuilder } from "../../common/Builder/BlocksBuilder";
import type { FC } from "react";
import type { BlockProps } from "../../common/Builder";

type Props = BlockProps<string>;

const RadioBlock: FC<Props> = ({ meta, value }) => {
    let label = value;
    const { type } = useBlocksBuilder();

    const pipelines = useQueryWithClient(
        [QueryKey.PIPELINES],
        (client) => getPipelinesService(client, type as "contacts"|"deals"),
        { enabled: meta.name === "dealstage" && Boolean(type) && meta.options?.length === 0 },
    );

    const option = meta.options.find((o) => o.value === value);
    
    if (option?.label) {
        label = option?.label;
    }

    label = useMemo(() => {
        const stages = flatten(
            (pipelines.data?.results ?? []).map(({ stages }) => stages).filter(Boolean)
        );
        const stage = stages.find((s) => s.id === value);

        return stage?.label || label;
    }, [value, label, pipelines.data?.results]);

    return (
        <P5>{label || "-"}</P5>
    );
};

export { RadioBlock };
