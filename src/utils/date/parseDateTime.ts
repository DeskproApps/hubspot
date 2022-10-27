import isDate from "date-fns/isDate";
import { DateTime } from "../../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDateTime = (date?: any): DateTime|null => {
    if (isDate(date)) {
        return date.toISOString();
    }

    return null;
};

export { parseDateTime };
