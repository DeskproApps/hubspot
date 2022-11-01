import { ReactElement } from "react";
import { Option } from "../types";

const getOption = <Value, >(
    value: Value,
    label: string|ReactElement,
): Option<Value> => ({
    label,
    value,
    key: value,
    type: "value",
});

const noOwnerOption = getOption("", "No owner");

export { getOption, noOwnerOption };
