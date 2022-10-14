import {FC, useMemo} from "react";
import styled from "styled-components";
import capitalize from "lodash/capitalize";
import { P5, H3, HorizontalDivider } from "@deskpro/app-sdk";
import { getFullName, getSymbolFromCurrency } from "../../utils";
import { format } from "../../utils/date";
import {
    Link,
    Title,
    TwoColumn,
    OverflowText,
    BaseContainer,
} from "../common";
import type {AccountInto, Pipeline, PipelineStage} from "../../services/hubspot/types";
import {DealPipeline} from "../../types";

const DealContainer = styled.div`
    margin-bottom: 14px;
`;

type DealOwner = {
    id: string,
    firstName: string,
    lastName: string,
};

type DealProps = {
    hs_object_id: string,
    dealname: string,
    dealstage: string,
    amount: string,
    closedate: string,
    hubspot_owner_id: DealOwner["id"],
    dealPipelines?: DealPipeline[],
};

type Props = {
    deals: DealProps[],
    accountInfo?: AccountInto,
    owners: Record<DealOwner["id"], DealOwner>,
    dealPipelines?: DealPipeline[],
};

const Deal: FC<DealProps & { owner: DealOwner, accountInfo?: AccountInto }> = ({
    owner,
    amount,
    dealname,
    dealstage,
    closedate,
    accountInfo,
    dealPipelines,
    hs_object_id: dealId,
}) => {
    const pipeline: Pipeline|null = useMemo(() => {
        if (dealPipelines && dealId) {
            return dealPipelines.filter((dp) => dp && dp.dealId === dealId)[0]?.pipeline ?? null;
        }

        return null;
    }, [dealPipelines, dealId]);

    const stage: PipelineStage|null = pipeline
        ? pipeline.stages.find(({ id }) => id === dealstage) || null
        : null
    ;

    return (
        <DealContainer>
            <Title
                as={H3}
                title={(
                    <Link to={`/deal/${dealId}`}>{dealname}</Link>
                )}
                link=""
                marginBottom={7}
            />
            <TwoColumn
                leftLabel="Stage"
                leftText={<OverflowText as={P5}>{capitalize(stage ? stage.label : dealstage)}</OverflowText>}
                rightLabel="Amount"
                rightText={amount ? `${getSymbolFromCurrency(accountInfo?.companyCurrency)} ${amount}` : "-"}
            />
            <TwoColumn
                leftLabel="Owner"
                leftText={getFullName(owner) || "-"}
                rightLabel="Close Date"
                rightText={format(closedate)}
            />
        </DealContainer>
    );
};

const Deals: FC<Props> = ({ deals, owners, accountInfo, dealPipelines }) => {
    return (
        <>
            <BaseContainer>
                <Title title={`Deals (${deals.length})`} />
                {deals.map((deal) => (
                    <Deal
                        key={deal.hs_object_id}
                        {...deal}
                        owner={owners[deal?.hubspot_owner_id] || {}}
                        accountInfo={accountInfo}
                        dealPipelines={dealPipelines}
                    />
                ))}
            </BaseContainer>
            <HorizontalDivider/>
        </>
    );
};

export { Deals };
