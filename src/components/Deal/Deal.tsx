import { FC } from "react";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { DealInfo } from "./DealInfo";
import { AssociatedWith } from "./AssociatedWith";

const Deal: FC = () => {
    return (
        <>
            <DealInfo/>
            <HorizontalDivider/>
            <AssociatedWith/>
        </>
    );
};

export { Deal };
