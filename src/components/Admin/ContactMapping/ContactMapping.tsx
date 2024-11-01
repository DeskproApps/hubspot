import { useState, useCallback } from "react";
import { TabBar } from "@deskpro/deskpro-ui";
import { TABS } from "../../../constants";
import { BaseContainer, StructureBuilder } from "../../common";
import type { FC } from "react";
import type { TabBarItemType } from "@deskpro/deskpro-ui";
import type { ContactLayout } from "../../../types";
import type { MetaMap } from "../../../components/common/Builder/StructureBuilder";

type Props = {
    properties: string[];
    onChangeStructure: (structure: { home: string[][], view: string[][] }) => void;
    structure: ContactLayout;
    meta?: MetaMap;
};

const tabs: TabBarItemType[] = [
    { label: "Contact Home Screen" },
    { label: "Contact View Screen" },
];

const ContactMapping: FC<Props> = ({
    meta,
    structure,
    properties,
    onChangeStructure,
}) => {
    const [activeTab, setActiveTab] = useState<number>(TABS.HOME);

    const onChangeHome = useCallback((home: string[][]) => {
        onChangeStructure({ ...structure, home });
      }, [structure, onChangeStructure]);
  
    const onChangeView = useCallback((view: string[][]) => {
        onChangeStructure({ ...structure, view });
    }, [structure, onChangeStructure]);

    return (
        <BaseContainer>
            <TabBar
                type="tab"
                tabs={tabs}
                activeIndex={activeTab}
                onClickTab={setActiveTab}
                containerStyles={{
                    padding: "0 12px",
                    justifyContent: "flex-start",
                    margin: "16px 0 8px",
                    gap: "10px",

                }}
            />
            {(activeTab === TABS.HOME) && (
                <StructureBuilder
                    structure={structure.home}
                    items={properties}
                    onChange={onChangeHome}
                    meta={meta}
                />
            )}
            {(activeTab === TABS.VIEW) && (
                <StructureBuilder
                    structure={structure.view}
                    items={properties}
                    onChange={onChangeView}
                    meta={meta}
                />
            )}
        </BaseContainer>
    );
};

export { ContactMapping };
