import { isEmpty } from "lodash-es";
import type { Config } from "../types";

const validateConfig = <Meta,>(
  structure: Config<Meta>["structure"],
  metaMap: Config<Meta>["metaMap"],
): void => {
  if (!Array.isArray(structure) || isEmpty(structure)) {
    throw new Error("PageBuilder: wrong config - empty structure");
  }

  if (isEmpty(metaMap)) {
    throw new Error("PageBuilder: wrong config - empty meta");
  }
};

export { validateConfig };
