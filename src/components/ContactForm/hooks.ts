import { useEffect, Dispatch, SetStateAction } from "react";
import { getOption } from "../../utils";
import type { LeadStatusOption, PipelineStage } from "../../services/hubspot/types";
import type { Option } from "../../types";

type UseSetStateFn<T> = Dispatch<SetStateAction<T>>;

type StageOptions = Array<Option<PipelineStage["id"]>>;

type LeadStatusOptions = Array<Option<LeadStatusOption["value"]>>;

const useLifecycleStageOptions = (
    stages: PipelineStage[],
    setStateFn: UseSetStateFn<StageOptions>,
): void => {
    useEffect(() => {
        if (Array.isArray(stages) && stages.length > 0) {
            setStateFn(
                stages.map(({ id, label }) => getOption<PipelineStage["id"]>(id, label))
            );
        }
    }, [stages, setStateFn])
};

const useLeadStatusOptions = (
    leadStatuses: LeadStatusOption[],
    setStateFn: UseSetStateFn<LeadStatusOptions>,
): void => {
    useEffect(() => {
        if (Array.isArray(leadStatuses) && leadStatuses.length > 0) {
            setStateFn(leadStatuses.map(({ value, label }) => getOption(value, label)));
        }
    }, [leadStatuses, setStateFn]);
};

export {
    useLeadStatusOptions,
    useLifecycleStageOptions,
};
