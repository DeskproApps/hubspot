import { FC } from "react";
import get from "lodash/get";
import capitalize from "lodash/capitalize";
import { Title } from "@deskpro/app-sdk";
import { BaseContainer, TextBlockWithLabel } from "../common";
import { getFullName, getSymbolFromCurrency } from "../../utils";
import { format } from "../../utils/date";
import type { Props } from "./types";

const DealInfo: FC<Props> = ({ deal, pipeline, accountInfo, owner, dealTypes }) => {
    const stage = pipeline.stages?.find(({ id }) => id === deal.dealstage);
    const dealType = dealTypes?.options?.find(({ value }) => value === deal.dealtype);
    const amount = deal.amount ? `${getSymbolFromCurrency(deal, accountInfo)} ${deal.amount}` : "-";

    return (
        <BaseContainer>
            <Title title={deal?.dealname} />
            <TextBlockWithLabel label="Pipeline" text={pipeline.label} />
            <TextBlockWithLabel label="Deal stage" text={stage?.label || deal?.dealstage} />
            <TextBlockWithLabel label="Amount" text={amount} />
            <TextBlockWithLabel label="Close date" text={format(deal.closedate)} />
            <TextBlockWithLabel label="Deal owner" text={getFullName(owner)}/>
            <TextBlockWithLabel label="Deal type" text={get(dealType, ["label"], "-")} />
            <TextBlockWithLabel label="Priority" text={capitalize(deal.hs_priority)} />
        </BaseContainer>
    );
};

export { DealInfo };
