import { default as fnsFormat } from "date-fns/format";
import { FORMAT } from "./constants";
import { DateTime } from "../../types";

const format = (date?: DateTime): string => {
    if (!date) {
        return "-";
    }

    return fnsFormat(new Date(date), FORMAT);
};

export { format };
