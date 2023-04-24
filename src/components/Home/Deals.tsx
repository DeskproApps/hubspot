import { FC } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import styled from "styled-components";
import get from "lodash/get";
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
import type {
    Contact,
    Pipeline,
    AccountInto,
    PipelineStage,
    Deal as DealType, Company,
} from "../../services/hubspot/types";

const DealContainer = styled.div`
    margin-bottom: 14px;
`;

type DealOwner = {
    id: string,
    firstName: string,
    lastName: string,
};

type Props = {
    deals: Array<DealType["properties"]>,
    accountInfo?: AccountInto,
    owners: Record<DealOwner["id"], DealOwner>,
    dealPipelines?: Record<Pipeline["id"], Pipeline>,
    contact: Contact["properties"],
    companies: Array<Company["properties"]>,
};

const Deal: FC<{
    deal: DealType["properties"],
    owner: DealOwner,
    dealPipelines: Props["dealPipelines"],
    accountInfo?: AccountInto,
}> = ({ deal, dealPipelines, owner, accountInfo }) => {
    const { amount, dealname, pipeline, dealstage, closedate, hs_object_id: dealId } = deal;
    const portalId = get(accountInfo, ["portalId"]);
    const pipelineData: Pipeline|null = get(dealPipelines, [pipeline], null);
    const pipeLineStage: PipelineStage|null = pipelineData
        ? pipelineData.stages.find(({ id }) => id === dealstage) || null
        : null;

    return (
        <DealContainer>
            <Title
                as={H3}
                title={(
                    <Link to={`/deal/${dealId}`}>{dealname}</Link>
                )}
                link={(portalId && dealId)
                    ? `https://app.hubspot.com/contacts/${portalId}/deal/${dealId}`
                    : ""
                }
                marginBottom={7}
            />
            <TwoColumn
                leftLabel="Stage"
                leftText={(
                    <OverflowText as={P5}>
                        {capitalize(pipeLineStage ? pipeLineStage.label : dealstage)}
                    </OverflowText>
                )}
                rightLabel="Amount"
                rightText={amount ? `${getSymbolFromCurrency(deal, accountInfo)} ${amount}` : "-"}
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

const Deals: FC<Props> = ({
    deals,
    owners,
    accountInfo,
    dealPipelines,
    contact: { hs_object_id: contactId },
    companies,
}) => {
    const navigate = useNavigate();
    const companyId = get(companies, [0, "hs_object_id"], null);

    return (
        <>
            <BaseContainer>
                <Title
                    title={`Deals (${deals.length})`}
                    link={accountInfo?.portalId
                        ? `https://app.hubspot.com/contacts/${accountInfo?.portalId}/deals`
                        : ""
                    }
                    onClick={() => navigate({
                        pathname: `/deal/create`,
                        search: `?${createSearchParams({
                            contactId,
                            ...(!companyId ? {} : { companyId }),
                        })}`
                    })}
                />
                {deals.map((deal) => (
                    <Deal
                        key={deal.hs_object_id}
                        deal={deal}
                        owner={get(owners, [deal?.hubspot_owner_id])}
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
