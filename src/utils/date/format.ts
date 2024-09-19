import { default as fnsFormat } from "date-fns/format";
import { DATE_FORMAT } from "./constants";
import { DateTime } from "../../types";

const format = (date?: DateTime, pattern = DATE_FORMAT): string => {
    if (!date) {
        return "-";
    }

    return fnsFormat(new Date(date), pattern);
};

export { format };
