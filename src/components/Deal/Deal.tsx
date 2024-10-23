import { HorizontalDivider } from "@deskpro/app-sdk";
import { DealInfo } from "./DealInfo";
import { AssociatedWith } from "./AssociatedWith";
import type { FC } from "react";
import type { Props } from "./types";

const Deal: FC<Props> = ({ deal, accountInfo, contacts, companies, dealMetaMap }) => {
    return (
        <>
            <DealInfo
                deal={deal}
                accountInfo={accountInfo}
                dealMetaMap={dealMetaMap}
            />
            <HorizontalDivider/>
            <AssociatedWith contacts={contacts} companies={companies} />
        </>
    );
};

export { Deal };
