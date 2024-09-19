import { isString, isPrimitive } from "../../../../utils";
import type { DropdownItemType, DropdownValueType } from "@deskpro/deskpro-ui";

const NO_FOUND = "No item(s) found";

const getFilteredOptions = <T,>(
  options: Array<DropdownValueType<T>>,
  input?: string,
): Array<DropdownItemType<T>> => {
  const searchInput: string = input || "";

  if (!Array.isArray(options) || !options.length) {
    return [{ type: "header", label: NO_FOUND }];
  }

  const filteredOptions = options
    .filter((o) => {
      const label = o?.label;
      const description = o?.description;
      const search = isPrimitive(label) ? `${label}` : description || "";

      return !search
        ? true
        : (isString(search) ? search.toLowerCase() : search).includes(searchInput.toLowerCase());
    });

  if (!Array.isArray(filteredOptions) || !filteredOptions.length) {
    return [{ type: "header", label: NO_FOUND }];
  } else {
    return filteredOptions;
  }
};

export { getFilteredOptions, isPrimitive };
