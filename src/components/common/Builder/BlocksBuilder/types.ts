import type { FC } from "react";
import type { PropertyMeta } from "../../../../services/hubspot/types";
import type { Layout } from "../types";

export type BlocksMap = Record<PropertyMeta["fieldType"], FC<BlockProps>>;

export type Config = {
  structure: Layout;
  metaMap: Record<PropertyMeta["fieldType"], PropertyMeta>;
};

export type Values = Record<PropertyMeta["name"], string>;

export type BlocksBuilderProps = {
    type: "contacts"|"deals";
    config: Config;
    blocksMap: BlocksMap;
    values?: Values;
};

export type BlockProps<Value = string> = {
    meta: PropertyMeta;
    value: Value;
};
