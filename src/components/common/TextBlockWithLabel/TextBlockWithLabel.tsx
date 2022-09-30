import { FC, ReactElement, isValidElement } from "react";
import styled from "styled-components";
import { P8, P5, Stack } from "@deskpro/app-sdk";

export type Props = {
    label?: string | ReactElement,
    text?: string | number | ReactElement,
    marginBottom?: number,
};

const Container = styled.div<Props>`
    margin-bottom: ${({ marginBottom }) => `${marginBottom}px`};
`;

const Label = styled(P8)`
    color: ${({ theme }) => (theme.colors.grey80)};
`;

const TextBlockWithLabel: FC<Props> = ({ text, label, marginBottom = 10 }) => {
    let textBlock: ReactElement | null = null;

    if (typeof text === "string" || typeof text === "number") {
        textBlock = (<P5>{text}</P5>);
    } else if (isValidElement(text)) {
        textBlock = (<Stack gap={5} align="baseline">{text}</Stack>)
    }

    return (
        <Container marginBottom={marginBottom}>
            {label && <Label>{label}</Label>}
            {textBlock && textBlock}
        </Container>
    );
}

export { TextBlockWithLabel };
