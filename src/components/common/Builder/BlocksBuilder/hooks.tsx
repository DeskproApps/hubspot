import { useContext, createContext } from "react";
import type { FC, PropsWithChildren } from "react";
import type { BlocksBuilderProps } from "./types";

type Props = {
    type: null|BlocksBuilderProps["type"];
};

const BlocksBuildeContext = createContext<Props>({ type: null });

const BlocksBuildeProvider: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
  return (
    <BlocksBuildeContext.Provider value={props}>
      {children}
    </BlocksBuildeContext.Provider>
  );
};

const useBlocksBuilder = () => useContext(BlocksBuildeContext);

export { BlocksBuildeProvider, useBlocksBuilder };
