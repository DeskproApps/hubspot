import { FC } from "react";
import styled from "styled-components";
import capitalize from "lodash/capitalize";
import { H3, HorizontalDivider } from "@deskpro/app-sdk";
import { getFullName } from "../../utils";
import { format } from "../../utils/date";
import {
    Title,
    TwoColumn,
    BaseContainer,
} from "../common";

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
};

type Props = {
    deals: DealProps[],
    owners: Record<DealOwner["id"], DealOwner>,
};

const Deal: FC<DealProps & { owner: DealOwner }> = ({ dealname, dealstage, amount, closedate, owner }) => (
    <DealContainer>
        <Title as={H3} title={dealname} link="" marginBottom={7} />
        <TwoColumn
            leftLabel="Stage"
            leftText={capitalize(dealstage)}
            rightLabel="Amount"
            rightText={amount/* ToDo: add currency symbol */}
        />
        <TwoColumn
            leftLabel="Owner"
            leftText={getFullName(owner) || "-"}
            rightLabel="Close Date"
            rightText={format(closedate)}
        />
    </DealContainer>
);

const Deals: FC<Props> = ({ deals, owners }) => {
    return (
        <>
            <BaseContainer>
                <Title title={`Deals (${deals.length})`} />
                {deals.map((deal) => (
                    <Deal key={deal.hs_object_id} {...deal} owner={owners[deal?.hubspot_owner_id] || {}} />
                ))}
            </BaseContainer>
            <HorizontalDivider/>
        </>
    );
};

export { Deals };
