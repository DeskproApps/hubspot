import { z } from "zod";
import { isEmptyObject } from "../../../../utils";
import type { LayoutItem } from "../types";
import type { Config, FormValues } from "./types";

const validateConfig = (
  structure: Config["structure"],
  metaMap: Config["metaMap"],
): void => {
  if (structure.length === 0) {
    throw new Error("FormBuilder: wrong config - empty structure");
  }

  if (isEmptyObject(metaMap)) {
    throw new Error("FormBuilder: wrong config - empty meta");
  }
};

const getValidationSchema = (structure: LayoutItem[]) => {
  const schema = structure.reduce((acc, fieldName) => {
    return { ...acc, [fieldName]: z.unknown() };
    }, {});

  return z.object(schema);
};

const getInitValues = (
  structure: LayoutItem[],
  values?: FormValues,
) => {
  return structure.reduce((acc, fieldName) => ({
    ...acc,
    [fieldName]: (values || {})[fieldName] || "",
  }), {});
};

export {
  getInitValues,
  validateConfig,
  getValidationSchema,
};
