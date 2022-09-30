import { FC } from "react";
import { HorizontalDivider } from "@deskpro/app-sdk";
import {
    Title,
    BaseContainer,
    TextBlockWithLabel,
} from "../common";

const ContactInfo: FC = () => {
    return (
        <section>
            <BaseContainer>
                <Title
                    title="John Jones"
                    link="https://github.com/zpawn"
                />
                <TextBlockWithLabel label="Email" text="mthurn@live.com" />
                <TextBlockWithLabel label="Phone" text="078 4685 2935" />
                <TextBlockWithLabel label="Job title" text="Manager" />
                <TextBlockWithLabel label="Owner" text="Tina Aghopian" />
                <TextBlockWithLabel label="Lifecycle stage" text="Subscriber" />
                <TextBlockWithLabel label="Primary company" text="Morningstar, Inc" />
            </BaseContainer>
            <HorizontalDivider/>
        </section>
    );
};

export { ContactInfo };
