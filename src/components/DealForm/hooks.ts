import { useEffect } from "react";
import sortBy from "lodash/sortBy";
import cloneDeep from "lodash/cloneDeep";
import { getOption } from "../../utils";
import type {
    Pipeline,
    PipelineStage,
} from "../../services/hubspot/types";
import type { Option, UseSetStateFn } from "../../types";

type PipelineOptions = Array<Option<Pipeline["id"]>>

type StageOptions = Array<Option<PipelineStage["id"]>>;

const usePipelineOptions = (
    pipelines: Pipeline[],
    setStateFn: UseSetStateFn<PipelineOptions>,
): void => {
    useEffect(() => {
        const sortedPipelines = (pipelines.length <= 1)
            ? cloneDeep<Pipeline[]>(pipelines)
            : sortBy<Pipeline>(pipelines, ["displayOrder"]);

        setStateFn(
            sortedPipelines.map(({ id, label }) => getOption(id, label))
        );
    }, [pipelines, setStateFn]);
};

const useStageOptions = (
    pipelineId: Pipeline["id"],
    pipelines: Pipeline[],
    setStateFn: UseSetStateFn<StageOptions>,
): void => {
    useEffect(() => {
        let options: StageOptions = [];

        if (pipelineId && pipelines.some(({ id }) => pipelineId === id)) {
            const pipeline = pipelines.find(({ id }) => pipelineId === id);
            options = (pipeline?.stages ?? []).map(({ id, label }) => getOption(id, label));
        }

        setStateFn(options);
    }, [pipelineId, pipelines, setStateFn]);
};

export {
    useStageOptions,
    usePipelineOptions,
};
