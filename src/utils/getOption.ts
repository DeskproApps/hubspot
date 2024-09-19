import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Option } from "../types";

const getOption = <Value, >(
    value: Value,
    label?: DropdownValueType<Value>["label"],
    description?: DropdownValueType<Value>["description"],
): Option<Value> => ({
    value,
    label: label || `${value}`,
    key: `${value}`,
    type: "value",
    ...(description ? { description } : {}),
});

const noOwnerOption = getOption("", "No owner");

export { getOption, noOwnerOption };
