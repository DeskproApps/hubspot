import { PropertyRow } from "@deskpro/app-sdk";
import { GenerateBlock } from "./GenerateBlock";
import type { FC } from "react";
import type { PropertyMeta } from "../../../../services/hubspot/types";
import type { Values, BlocksMap } from "./types";

type Props = {
  row: string[],
  metaMap: Record<PropertyMeta["fieldType"], PropertyMeta>,
  blocksMap: BlocksMap,
  values?: Values,
};

const RenderRow: FC<Props> = ({
  row,
  metaMap,
  blocksMap,
  values,
}) => {
  return (
    <PropertyRow marginBottom={10} style={{ boxSizing: "border-box", padding: "0 8px" }}>
      {row.map((name) => {
        const meta = metaMap[name];
        const blockType = meta.fieldType;
        const value = (values ?? {})[name];
        const Component = blocksMap[blockType];

        return (
          <GenerateBlock
            key={name}
            meta={meta}
            Component={Component}
            value={value}
          />
        );
      })}
    </PropertyRow>
  );
};

export { RenderRow };
