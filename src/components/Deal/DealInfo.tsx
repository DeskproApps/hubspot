import { FC } from "react";
import {
    Title,
    BaseContainer,
    TextBlockWithLabel,
} from "../common";

const DealInfo: FC = () => {
    return (
        <BaseContainer>
            <Title title="Deal One" />
            <TextBlockWithLabel label="Pipeline" text="Sales Pipeline"/>
            <TextBlockWithLabel label="Deal stage" text="Appointment scheduled"/>
            <TextBlockWithLabel label="Amount" text="$1,000"/>
            <TextBlockWithLabel label="Close date" text="23/08/2022"/>
            <TextBlockWithLabel label="Deal owner" text="Tina Aghopian (you)"/>
            <TextBlockWithLabel label="Deal type" text="Existing Business"/>
            <TextBlockWithLabel label="Priority" text="Medium"/>
        </BaseContainer>
    );
};

export { DealInfo };
