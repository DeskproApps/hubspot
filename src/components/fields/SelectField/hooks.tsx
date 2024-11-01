import { useMemo } from "react";
import { Member } from "@deskpro/app-sdk";
import { useQueryWithClient } from "../../../hooks";
import { getOwnersService, getPipelinesService } from "../../../services/hubspot";
import { QueryKey } from "../../../query";
import { getOption, getFullName } from "../../../utils";
import { useBuilder } from "../../common/Builder";
import type { Option } from "../../../types";
import type { PropertyMeta, PipelineTypes } from "../../../services/hubspot/types";

type UseSelectField = (meta: PropertyMeta) => {
    options: Array<Option<string>>;
};

const useSelectField: UseSelectField = (meta) => {
    const { type } = useBuilder();
    const isOwner = meta.referencedObjectType === "OWNER";
    const isPipeline = meta.name === "pipeline";

    const owners = useQueryWithClient(
        [QueryKey.OWNERS],
        getOwnersService,
        { enabled: isOwner },
    );

    const pipelines = useQueryWithClient(
        [QueryKey.PIPELINES, type],
        (client) => getPipelinesService(client, type as PipelineTypes),
        { enabled: isPipeline && Boolean(type) && meta.options?.length === 0 },
    );

    const options = useMemo(() => {
        return isOwner
            ? (owners.data?.results ?? []).map((owmer) => 
                getOption(owmer.id, <Member name={getFullName(owmer)} />, getFullName(owmer))
            )
            : isPipeline
            ? (pipelines.data?.results ?? []).map((pipeline) => getOption(pipeline.id, pipeline.label))
            : meta.options?.map((o) => getOption(o.value, o.label));
    }, [isOwner, isPipeline, meta.options, owners.data?.results, pipelines.data?.results]);

    return { options };
};

export { useSelectField };
