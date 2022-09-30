import { FC } from "react";
import styled from "styled-components";
import { H3, HorizontalDivider } from "@deskpro/app-sdk";
import {
    Title,
    TwoColumn,
    BaseContainer,
} from "../common";

const deals = [
    { id: 0, title: "London Cleaning Contract", stage: "Negotiation", amount: "£10,000", owner: "Steve Smith", closeDate: "15 Mar, 2021" },
    { id: 1, title: "Deal Name", stage: "Negotiation", amount: "£50,000", owner: "Steve Smith", closeDate: "15 Mar, 2021" },
];

const DealContainer = styled.div`
    margin-bottom: 14px;
`;

type DealProps = {
    title: string,
    stage: string,
    amount: string,
    owner: string,
    closeDate: string,
};

const Deal: FC<DealProps> = ({ title, stage, amount, owner, closeDate }) => (
    <DealContainer>
        <Title as={H3} title={title} link="https://github.com/zpawn" marginBottom={7} />
        <TwoColumn
            leftLabel="Stage"
            leftText={stage}
            rightLabel="Amount"
            rightText={amount}
        />
        <TwoColumn
            leftLabel="Owner"
            leftText={owner}
            rightLabel="Close Date"
            rightText={closeDate}
        />
    </DealContainer>
);

const Deals: FC = () => {
    return (
        <>
            <BaseContainer>
                <Title
                    link="https://github.com/zpawn"
                    title="Deals (2)"
                    onClick={() => {}}
                />
                {deals.map((deal) => (
                    <Deal key={deal.id} {...deal} />
                ))}
            </BaseContainer>
            <HorizontalDivider/>
        </>
    );
};

export { Deals };
