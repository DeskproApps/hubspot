import type { FC } from "react";
import type { PropertyMeta } from "../../../../services/hubspot/types";
import type { Layout } from "../types";

export type BlocksMap = Record<PropertyMeta["fieldType"], FC<BlockProps>>;

export type Config = {
  structure: Layout;
  metaMap: Record<PropertyMeta["fieldType"], PropertyMeta>;
};

export type Values = Record<PropertyMeta["name"], unknown>;

export type BlocksBuilderProps = {
    config: Config;
    blocksMap: BlocksMap;
    values?: Values;
};

export type BlockProps<Value = unknown> = {
    meta: PropertyMeta;
    value: Value;
};
