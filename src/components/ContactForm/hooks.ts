import { useEffect, Dispatch, SetStateAction } from "react";
import concat from "lodash/concat";
import { getOption, noOwnerOption } from "./utils";
import { getFullName } from "../../utils";
import type { Owner, LeadStatusOption, PipelineStage } from "../../services/hubspot/types";
import type { Option } from "./types";

type UseSetStateFn<T> = Dispatch<SetStateAction<T>>

type StageOptions = Array<Option<PipelineStage["id"]>>;

type LeadStatusOptions = Array<Option<LeadStatusOption["value"]>>;

type OwnerOptions = Array<Option<Owner["id"]>>;

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

const useOwnerOptions = (
    owners: Owner[],
    setStateFn: UseSetStateFn<OwnerOptions>,
): void => {
    useEffect(() => {
        let options = [noOwnerOption];

        if (Array.isArray(owners) && owners.length > 0) {
            options = concat(
                options,
                owners.map((owner) => getOption(owner.id, getFullName(owner))),
            );
        }

        setStateFn(options);
    }, [owners, setStateFn]);
};

export {
    useOwnerOptions,
    useLeadStatusOptions,
    useLifecycleStageOptions,
};
