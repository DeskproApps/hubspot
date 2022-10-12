import { Deal, Pipeline } from "../../services/hubspot/types";

export type Props = {
    deal: Deal["properties"],
    pipeline: Pipeline
};
