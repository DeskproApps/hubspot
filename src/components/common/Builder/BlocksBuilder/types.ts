import type { FC } from "react";

// @todo change key as keyof blocksMap
export type BlocksMap = Record<string, FC>;

export type Config<Meta> = {
  structure: string[][];
  metaMap: Record<string, Meta>;
};

export type Values = Record<string, unknown>;

export type BlocksBuilderProps<Meta> = {
    config: Config<Meta>;
    blocksMap: BlocksMap;
    values?: Values;
};

export type BlockProps<Meta, Value> = {
    meta: Meta;
    value: Value;
};
