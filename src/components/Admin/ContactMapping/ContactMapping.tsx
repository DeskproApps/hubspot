import { TabBar } from "@deskpro/deskpro-ui";
import { TABS } from "../../../constants";
import { BaseContainer, StructureBuilder } from "../../common";
import type { FC, Dispatch, SetStateAction } from "react";
import type { TabBarItemType } from "@deskpro/deskpro-ui";

type Props = {
    properties: string[];
    activeTab: number,
    tabs: TabBarItemType[],
    onChangeHome: (structure: string[][]) => void;
    onChangeView: (structure: string[][]) => void;
    structure: { home: string[][], view: string[][] };
    onChangeTab: Dispatch<SetStateAction<number>>;
};

const ContactMapping: FC<Props> = ({
    tabs,
    activeTab,
    structure,
    properties,
    onChangeTab,
    onChangeHome,
    onChangeView,
}) => {
    return (
        <BaseContainer>
            <TabBar
                type="tab"
                tabs={tabs}
                activeIndex={activeTab}
                onClickTab={onChangeTab}
                containerStyles={{
                    padding: "0 12px",
                    justifyContent: "flex-start",
                    margin: "16px 0 8px",
                    gap: "10px",

                }}
            />
            {(activeTab === TABS.HOME) && (
                <StructureBuilder structure={structure.home} items={properties} onChange={onChangeHome}/>
            )}
            {(activeTab === TABS.VIEW) && (
                <StructureBuilder structure={structure.view} items={properties} onChange={onChangeView}/>
            )}
        </BaseContainer>
    );
};

export { ContactMapping };
