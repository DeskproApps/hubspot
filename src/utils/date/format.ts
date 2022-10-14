import { default as fnsFormat } from "date-fns/format";
import { FORMAT } from "./constants";
import { DateTime } from "../../types";

const format = (date?: DateTime, pattern = FORMAT): string => {
    if (!date) {
        return "-";
    }

    return fnsFormat(new Date(date), pattern);
};

export { format };
