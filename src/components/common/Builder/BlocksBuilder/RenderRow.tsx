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
    <PropertyRow marginBottom={10} style={{ boxSizing: "border-box" }}>
      {row.map((name) => {
        const meta = metaMap[name];
        const blockType = meta.fieldType;
        const value = (values ?? {})[name];
        const Component = blocksMap[blockType];

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
