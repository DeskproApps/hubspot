import { Property } from "@deskpro/app-sdk";
import type { BlockProps } from "./types";
import type { PropertyMeta } from "../../../../services/hubspot/types";
import type { FC } from "react";

type Props = {
  meta: PropertyMeta;
  Component: FC<BlockProps>;
  value: string;
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
