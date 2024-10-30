import type { PropertyMeta } from "../../../../services/hubspot/types";

export type MetaMap = Record<PropertyMeta["name"], PropertyMeta>;

export type DragItem = {
  index: number;
  rowIndex: number;
  type: string;
};
