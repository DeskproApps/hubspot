import { FC } from "react";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { DealInfo } from "./DealInfo";
import { AssociatedWith } from "./AssociatedWith";
import type { Deal as DealType } from "../../services/hubspot/types";

const Deal: FC<{ deal: DealType["properties"] }> = () => {
    return (
        <>
            <DealInfo/>
            <HorizontalDivider/>
            <AssociatedWith/>
        </>
    );
};

export { Deal };
