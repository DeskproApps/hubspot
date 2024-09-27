import { get } from "lodash-es";
import { Property } from "@deskpro/app-sdk";
import type { ComponentType } from "react";
import type { Values } from "./types";

type Props<Meta> = {
  meta: Meta;
  Component: ComponentType<{ value: unknown } & Record<string, unknown>>;
  value: unknown;
};

const GenerateBlock = <Meta,>({ meta, Component, value }: Props<Meta>) => {
  const blockType = get(meta, ["type"]);
  const label = get(meta, ["label"]);

  if (!meta) {
    // eslint-disable-next-line no-console
    console.error("BlocksBuilder: wrong config - block config not found");
    return null;
  }

  if (!Component) {
    // eslint-disable-next-line no-console
    console.error(
      "BlocksBuilder: can't find component for block type:",
      blockType,
    );
  }

  return (
    <Property
      label={label}
      marginBottom={0}
      text={Component && (
        <Component meta={meta} value={value} />
      )}
    />
  );
};

export { GenerateBlock };
