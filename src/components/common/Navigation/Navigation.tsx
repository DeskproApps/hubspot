import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TwoButtonGroup } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { TwoButtonGroupProps } from "@deskpro/app-sdk";

export type Props = {
  onNavigateToLink?: TwoButtonGroupProps["twoOnClick"],
  onNavigateToCreate?: TwoButtonGroupProps["oneOnClick"],
};

const Navigation: FC<Props> = ({
  onNavigateToLink,
  onNavigateToCreate,
}) => (
  <TwoButtonGroup
    selected={onNavigateToCreate ? "one" : "two"}
    oneLabel="Find Contact"
    twoLabel="Create Contact"
    oneIcon={faSearch}
    twoIcon={faPlus}
    oneOnClick={onNavigateToLink || (() => { })}
    twoOnClick={onNavigateToCreate || (() => { })}
  />
);

export { Navigation };
