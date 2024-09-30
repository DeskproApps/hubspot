import { Property } from "@deskpro/app-sdk";
import { PropertyMeta } from "../../../../services/hubspot/types";
import type { ComponentType } from "react";

type Props = {
  meta: PropertyMeta;
  Component: ComponentType<{ value: unknown } & Record<string, unknown>>;
  value: unknown;
};

const GenerateBlock = ({ meta, Component, value }: Props) => {
  const blockType = meta?.type;
  const label = meta?.label;

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
