import { Property } from "@deskpro/app-sdk";
import { PropertyMeta } from "../../../../services/hubspot/types";
import type { ComponentType } from "react";

type Props = {
  meta: PropertyMeta;
  Component: ComponentType<{ value: unknown } & Record<string, unknown>>;
  value: unknown;
};

const GenerateBlock = ({ meta, Component, value }: Props) => {
  return (
    <Property
      label={meta.label}
      marginBottom={0}
      text={Component && (
        <Component meta={meta} value={value} />
      )}
    />
  );
};

export { GenerateBlock };
