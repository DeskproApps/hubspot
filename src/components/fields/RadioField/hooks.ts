import { useMemo } from "react";
import { useQueryWithClient } from "../../../hooks";
import { getOption } from "../../../utils";
import { getPipelinesService } from "../../../services/hubspot";
import { QueryKey } from "../../../query";
import { useBuilder } from "../../common/Builder";
import type { Option } from "../../../types";
import type { PropertyMeta } from "../../../services/hubspot/types";

type UseRadioField = (meta: PropertyMeta) => {
    options: Array<Option<string>>;
};

const useRadioField: UseRadioField = (meta) => {
    const { type } = useBuilder();

    const pipelines = useQueryWithClient(
        [QueryKey.PIPELINES],
        (client) => getPipelinesService(client, type as "contacts"|"deals"),
        {
            enabled: meta.name === "dealstage"
                && Boolean(type)
                && meta.options?.length === 0
        },
    );

    const options = useMemo(() => {
        if ((pipelines.data?.results ?? []).length > 0) {
            return (pipelines.data?.results ?? []).map((pipeline) => {
                return getOption(pipeline.id, pipeline.label);
            });
        } else if (meta.options.length > 0) {
            return meta.options.map((o) => {
                return getOption(o.value, o.label);
            });
        }

        return [];
    }, [meta.options, pipelines.data?.results]);

    return { options };
};

export { useRadioField };
