import { useMemo } from "react";
import { useQueryWithClient } from "../../../hooks";
import { useBlocksBuilder } from "../../common/Builder/BlocksBuilder";
import { getOwnersService, getPipelinesService } from "../../../services/hubspot";
import { QueryKey } from "../../../query";
import type { Owner, PropertyMeta, PipelineTypes } from "../../../services/hubspot/types";

type UseSelectBlock = (meta: PropertyMeta, value: string) => {
    isOwner: boolean;
    isPipeline: boolean;
    owner: Owner|undefined;
    displayValue: string|undefined;
};

const useSelectBlock: UseSelectBlock = (meta, value) => {
    const { type } = useBlocksBuilder();
    const isOwner = meta.referencedObjectType === "OWNER";
    const isPipeline = meta.name === "pipeline";

    const pipelines = useQueryWithClient(
        [QueryKey.PIPELINES, type],
        (client) => getPipelinesService(client, type as PipelineTypes),
        { enabled: Boolean(type) && isPipeline },
    );
    
    const owners = useQueryWithClient(
        [QueryKey.OWNERS],
        getOwnersService,
        { enabled: isOwner },
    );

    const owner = useMemo(() => {
        return (owners.data?.results ?? []).find(({ id }) => id === value);
    }, [value, owners.data]);

    const displayValue = meta.options.length > 0
        ? meta.options.find((o) => o.value === value)?.label
        : isPipeline
        ? pipelines.data?.results.find(({ id }) => id === value)?.label
        : value;

    return { isOwner, isPipeline, owner, displayValue };
};

export { useSelectBlock };
