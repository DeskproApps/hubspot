import { FC } from "react";
import get from "lodash/get";
import capitalize from "lodash/capitalize";
import {
    Title,
    BaseContainer,
    TextBlockWithLabel,
} from "../common";
import { getFullName, getSymbolFromCurrency } from "../../utils";
import { format } from "../../utils/date";
import { Props } from "./types";

const DealInfo: FC<Props> = ({ deal, pipeline, accountInfo, owner, dealTypes }) => {
    const stage = pipeline.stages.find(({ id }) => id === deal.dealstage) || {};
    const dealType = dealTypes.options.find(({ value }) => value === deal.dealtype);

    return (
        <BaseContainer>
            <Title title={deal?.dealname} />
            <TextBlockWithLabel label="Pipeline" text={pipeline.label} />
            <TextBlockWithLabel label="Deal stage" text={get(stage, ["label"], deal.dealstage)} />
            <TextBlockWithLabel
                label="Amount"
                text={`${deal.amount} ${getSymbolFromCurrency(accountInfo.companyCurrency)}`}
            />
            <TextBlockWithLabel label="Close date" text={format(deal.closedate)} />
            <TextBlockWithLabel label="Deal owner" text={getFullName(owner)}/>
            <TextBlockWithLabel label="Deal type" text={get(dealType, ["label"], "-")} />
            <TextBlockWithLabel label="Priority" text={capitalize(deal.hs_priority)} />
        </BaseContainer>
    );
};

export { DealInfo };
