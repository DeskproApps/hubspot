import { FC } from "react";
import styled from "styled-components";
import { TextBlockWithLabel } from "../TextBlockWithLabel";
import { ITextBlockWithLabel } from "../TextBlockWithLabel/TextBlockWithLabel";

export type Props = {
    leftLabel: ITextBlockWithLabel["label"],
    leftText: ITextBlockWithLabel["text"],
    rightLabel: ITextBlockWithLabel["label"],
    rightText: ITextBlockWithLabel["text"],
};

const Container = styled.div`
    width: 100%;
    margin-bottom: -1px;
`;

const Side = styled.div`
    display: inline-block;
    width: calc(49% - 6px);
`;

const Divider = styled.div`
    display: inline-block;
    width: 1px;
    height: 2em;
    background-color: ${({ theme }) => theme.colors.grey20};
    margin: 0 6px;
`;


const TwoColumn: FC<Props> = ({ leftLabel, leftText, rightLabel, rightText }) => (
    <Container>
        <Side>
            <TextBlockWithLabel
                label={leftLabel}
                text={leftText}
            />
        </Side>
        <Divider />
        <Side>
            <TextBlockWithLabel
                label={rightLabel}
                text={rightText}
            />
        </Side>
    </Container>
);

export { TwoColumn };
