import { useState, useCallback } from "react";
import { TabBar } from "@deskpro/deskpro-ui";
import { TABS } from "../../../constants";
import { BaseContainer, StructureBuilder } from "../../common";
import type { FC } from "react";
import type { TabBarItemType } from "@deskpro/deskpro-ui";
import type { DealLayout } from "../../../types";
import type { Layout } from "../../../components/common/Builder";
import type { MetaMap } from "../../../components/common/Builder/StructureBuilder";

type Props = {
    properties: string[];
    onChangeStructure: (structure: DealLayout) => void;
    structure: DealLayout;
    meta?: MetaMap;
};

const tabs: TabBarItemType[] = [
    { label: "Contact Home Screen" },
    { label: "Deal View Screen" },
];

const DealMapping: FC<Props> = ({
    meta,
    structure,
    properties,
    onChangeStructure,
}) => {
    const [activeTab, setActiveTab] = useState<number>(TABS.HOME);

    const onChangeHome = useCallback((list: Layout) => {
        onChangeStructure({ ...structure, list });
      }, [structure, onChangeStructure]);
  
    const onChangeView = useCallback((view: Layout) => {
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
                    structure={structure.list}
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

export { DealMapping };
