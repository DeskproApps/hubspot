import type { FC } from "react";
import type { PropertyMeta } from "../../../../services/hubspot/types";

export type BlocksMap = Record<PropertyMeta["fieldType"], FC>;

export type Config = {
  structure: string[][];
  metaMap: Record<PropertyMeta["fieldType"], PropertyMeta>;
};

export type Values = Record<PropertyMeta["name"], unknown>;

export type BlocksBuilderProps = {
    config: Config;
    blocksMap: BlocksMap;
    values?: Values;
};

export type BlockProps<Value> = {
    meta: PropertyMeta;
    value: Value;
};
