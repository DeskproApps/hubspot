import { FC } from "react";
import {
    Title,
    BaseContainer,
    TextBlockWithLabel,
} from "../common";
import { getFullName } from "../../utils";
import type { Props } from "./types";

const AssociatedWith: FC<Pick<Props, "contacts" | "companies">> = ({ contacts, companies }) => {
    const contactsFullName = contacts?.map(getFullName);
    const companyNames = companies?.map(({ name }) => name);

    return (
        <BaseContainer>
            <Title title="Associated with" />
            <TextBlockWithLabel label="Contact" text={contactsFullName?.join(", ") || "-"} />
            <TextBlockWithLabel label="Company" text={companyNames?.join(", ") || "-"} />
        </BaseContainer>
    );
};

export { AssociatedWith };
