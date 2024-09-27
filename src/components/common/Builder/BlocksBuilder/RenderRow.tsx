import { get } from "lodash-es";
import { PropertyRow } from "@deskpro/app-sdk";
import { GenerateBlock } from "./GenerateBlock";
import type { ReactNode } from "react";
import { Values, BlocksMap } from "./types";

type Props<Meta> = {
  row: string[],
  metaMap: Record<string, Meta>,
  blocksMap: BlocksMap,
  values?: Values,
};

const RenderRow = <Meta,>({
  row,
  metaMap,
  blocksMap,
  values,
}: Props<Meta>): ReactNode => {
  const isFull = get(metaMap, [row[0], "full"]);
  const styles = {
    boxSizing: "border-box",
    paddingLeft: isFull ? 0 : 8,
    paddingRight: isFull ? 0 : 8,
  };

  return (
    <PropertyRow marginBottom={10} style={styles}>
      {row.map((name) => {
        const meta = get(metaMap, name);
        const blockType = get(meta, ["fieldType"]);
        const value = get(values, [name]);
        const Component = get(blocksMap, [blockType]);

        if (!Component) {
          console.log(`>>> block:${blockType}:`, { meta, value });
        }

        return (
          <GenerateBlock<Meta>
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
