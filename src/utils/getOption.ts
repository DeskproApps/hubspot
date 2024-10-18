import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Option } from "../types";

const getOption = <Value extends string, >(
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

const noOwnerOption = getOption<string>("", "No owner");

export { getOption, noOwnerOption };
