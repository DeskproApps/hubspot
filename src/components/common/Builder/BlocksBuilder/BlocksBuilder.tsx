import { validateConfig } from "./utils";
import { RenderRow } from "./RenderRow";
import type { BlocksBuilderProps } from "./types";

const BlocksBuilder = ({
  values,
  config: { structure, metaMap },
  blocksMap,
}: BlocksBuilderProps) => {
  try {
    validateConfig(structure, metaMap);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  }

  return (
    <div style={{ marginTop: 8, marginBottom: 8 }}>
      {structure.map((row, idx) => (
        <RenderRow
          key={idx}
          row={row}
          metaMap={metaMap}
          blocksMap={blocksMap}
          values={values}
        />
      ))}
    </div>
  );
};

export { BlocksBuilder };
