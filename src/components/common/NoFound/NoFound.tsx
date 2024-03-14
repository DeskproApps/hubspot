import { FC } from "react";
import { P1 } from "@deskpro/deskpro-ui";
import { HorizontalDivider } from "@deskpro/app-sdk";

type Props = {
    text?: string,
};

const NoFound: FC<Props> = ({ text = "No found" } = {}) => (
    <>
        <P1>{text}</P1>
        <HorizontalDivider style={{ marginBottom: 9 }}/>
    </>
);

export { NoFound };
