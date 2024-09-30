import { isEmptyObject } from "../../../../../utils";
import type { Config } from "../types";

const validateConfig = <Meta,>(
  structure: Config<Meta>["structure"],
  metaMap: Config<Meta>["metaMap"],
): void => {
  if (!Array.isArray(structure) || structure.length === 0) {
    throw new Error("PageBuilder: wrong config - empty structure");
  }

  if (isEmptyObject(metaMap)) {
    throw new Error("PageBuilder: wrong config - empty meta");
  }
};

export { validateConfig };
