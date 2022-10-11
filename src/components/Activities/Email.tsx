import { FC } from "react";
import { Title, BaseContainer, TextBlockWithLabel } from "../common";

const Email: FC = () => {
    return (
        <BaseContainer>
            <Title title={"Delay in order (Sample)"} />
            <TextBlockWithLabel label="Description" text="John needs to review Q1 financials with his team before confirming the order. Bring Peggy up to speed. Follow up" />
            <TextBlockWithLabel label="Sent by" text="Geoff Minor" />
            <TextBlockWithLabel label="Contacted" text="Brian Halligan" />
            <TextBlockWithLabel label="Date/time" text="30 Apr, 2020 at 15:10" />
        </BaseContainer>
    )
};

export { Email };
