import { z } from "zod";
import { isEmptyObject } from "../../../../utils";
import type { PropertyMeta } from "../../../../services/hubspot/types";
import type { LayoutItem } from "../types";
import type { Config } from "./types";

const validateConfig = (
  structure: Config["structure"],
  metaMap: Config["metaMap"],
): void => {
  if (!Array.isArray(structure) || structure.length === 0) {
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
  values?: Record<PropertyMeta["name"], unknown>,
) => {
  return structure.reduce<Record<PropertyMeta["name"], unknown>>((acc, fieldName) => {
    return {
      ...acc,
      [fieldName]: (values || {})[fieldName] || "",
    };
  }, {});
};

export {
  getInitValues,
  validateConfig,
  getValidationSchema,
};
