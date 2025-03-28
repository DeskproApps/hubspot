import { useMemo, useState } from "react";
import {
    faCheck,
    faExternalLinkAlt,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "@deskpro/deskpro-ui";
import { getOption } from "../../../../utils";
import { getFilteredOptions } from "./utils";
import { Button } from "../../Button";
import type { FC } from "react";
import type { DropdownTargetProps } from "@deskpro/deskpro-ui";
import type { MetaMap } from "./types";

type Props = {
    items: string[];
    onAddItem: (item: string) => void;
    meta?: MetaMap;
};

const AddItemDropdown: FC<Props> = ({ items, onAddItem, meta }) => {
    const [searchInput, setSearchInput] = useState<string>("");
    const options = items.map((i) => getOption(i, (meta ?? {})[i]?.label ?? i));

    const currentOptions = useMemo(() => {
        return getFilteredOptions(options, searchInput);
      }, [options, searchInput]);

    return (
        <Dropdown
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="auto-end"
            inputValue={searchInput}
            onInputChange={setSearchInput}
            options={currentOptions}
            showInternalSearch
            hideIcons
            onSelectOption={({ value }) => onAddItem(value)}
        >
            {({ active, targetProps, targetRef }: DropdownTargetProps<HTMLButtonElement>) => (
                <Button
                    ref={targetRef}
                    {...targetProps}
                    active={active}
                    text="Add"
                    icon={faPlus}
                    intent="secondary"
                />
            )}
        </Dropdown>
    );
};

export { AddItemDropdown };
