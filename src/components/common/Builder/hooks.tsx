import { useContext, createContext } from "react";
import type { FC, PropsWithChildren } from "react";

type Props = {
    type: null|"contacts"|"deals";
};

const BuilderContext = createContext<Props>({ type: null });

const BuilderProvider: FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
  return (
    <BuilderContext.Provider value={props}>
      {children}
    </BuilderContext.Provider>
  );
};

const useBuilder = () => useContext(BuilderContext);

export { BuilderProvider, useBuilder };
