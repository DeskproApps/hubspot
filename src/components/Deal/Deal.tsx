import { FC } from "react";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { DealInfo } from "./DealInfo";
import { AssociatedWith } from "./AssociatedWith";
import type { Props } from "./types";

const Deal: FC<Props> = ({ deal, pipeline, accountInfo, owner, dealTypes, contacts, companies }) => {
    return (
        <>
            <DealInfo
                deal={deal}
                pipeline={pipeline}
                accountInfo={accountInfo}
                owner={owner}
                dealTypes={dealTypes}
            />
            <HorizontalDivider/>
            <AssociatedWith contacts={contacts} companies={companies} />
        </>
    );
};

export { Deal };
