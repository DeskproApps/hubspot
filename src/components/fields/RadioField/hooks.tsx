import { useMemo } from "react";
import { useQueryWithClient } from "../../../hooks";
import { getOption } from "../../../utils";
import { getPipelinesService } from "../../../services/hubspot";
import { QueryKey } from "../../../query";
import { useBuilder } from "../../common/Builder";
import type { FC, PropsWithChildren } from "react";
import type { DropdownItemType } from "@deskpro/deskpro-ui";
import type { Option } from "../../../types";
import type { PropertyMeta } from "../../../services/hubspot/types";

type UseRadioField = (meta: PropertyMeta) => {
    options: Array<Option<string>>;
};

const PipeLabel: FC<PropsWithChildren> = ({ children }) => (
    <span style={{ paddingLeft: "14px" }}>{children}</span>
);

const useRadioField: UseRadioField = (meta) => {
    const { type } = useBuilder();
    const isPipelineStage = meta.name === "dealstage";

    const pipelines = useQueryWithClient(
        [QueryKey.PIPELINES, type],
        (client) => getPipelinesService(client, type as "contacts"|"deals"),
        { enabled: Boolean(type) && isPipelineStage },
    );

    const options = useMemo(() => {
        return isPipelineStage ? 
            (pipelines.data?.results ?? []).reduce<Array<DropdownItemType<string>>>((acc, pipeline) => {
            return [
                { type: "header", label: pipeline.label },
                ...(pipeline.stages.map((p) => getOption(p.id, <PipeLabel>{p.label}</PipeLabel>))),
                ...acc,
            ];
            }, []) as Array<Option<string>>
            : meta.options.map((o) => getOption(o.value, o.label));
    }, [isPipelineStage, meta.options, pipelines.data?.results]);

    return { options };
};

export { useRadioField };
