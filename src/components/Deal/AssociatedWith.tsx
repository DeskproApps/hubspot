import { FC } from "react";
import {
    Title,
    BaseContainer,
    TextBlockWithLabel,
} from "../common";

const AssociatedWith: FC = () => {
    return (
        <BaseContainer>
            <Title title="Associated with" />
            <TextBlockWithLabel label="Contact" text="Matt Thurn" />
            <TextBlockWithLabel label="Company" text="HSBC" />
        </BaseContainer>
    );
};

export { AssociatedWith };
