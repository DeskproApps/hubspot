import { useMemo } from "react";
import { Member } from "@deskpro/app-sdk";
import { useQueryWithClient } from "../../../hooks";
import { getOwnersService, getPipelinesService } from "../../../services/hubspot";
import { QueryKey } from "../../../query";
import { getOption, getFullName } from "../../../utils";
import { useBuilder } from "../../common/Builder";
import type { FC, PropsWithChildren } from "react";
import type { DropdownItemType } from "@deskpro/deskpro-ui";
import type { Option } from "../../../types";
import type { PropertyMeta, PipelineTypes } from "../../../services/hubspot/types";

type UseSelectField = (meta: PropertyMeta) => {
    options: Array<Option<string>>;
};

const PipeLabel: FC<PropsWithChildren> = ({ children }) => (
    <span style={{ paddingLeft: "14px" }}>{children}</span>
);

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
        { enabled: Boolean(type) && isPipeline },
    );

    const options = useMemo(() => {
        return isOwner
            ? (owners.data?.results ?? []).map((owmer) => {
                return getOption(owmer.id, <Member name={getFullName(owmer)} />, getFullName(owmer));
            })
            : isPipeline
            ? (pipelines.data?.results ?? []).reduce<Array<DropdownItemType<string>>>((acc, pipeline) => {
                return [
                    { type: "header", label: pipeline.label },
                    ...(pipeline.stages.map((p) => getOption(p.id, <PipeLabel>{p.label}</PipeLabel>))),
                    ...acc,
                ];
            }, []) as Array<Option<string>>
            : meta.options?.map((o) => getOption(o.value, o.label));
    }, [isOwner, isPipeline, meta.options, owners.data?.results, pipelines.data?.results]);

    return { options };
};

export { useSelectField };
