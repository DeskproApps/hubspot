import styled, { DefaultTheme } from "styled-components";
import { P5 } from "@deskpro/deskpro-ui";
import { DEFAULT_ERROR } from "../../../constants";
import type { FC, ReactNode } from "react";

export type Props = {
    texts: ReactNode[];
};

const StyledErrorBlock = styled(P5)`
    width: 100%;
    margin-bottom: 8px;
    padding: 4px 6px;
    border-radius: 4px;
    // type-casting below as a temporary fix
    color: ${({ theme }) => (theme as DefaultTheme).colors.white};
    background-color: ${({ theme }) => (theme as DefaultTheme).colors.red100};
    box-sizing: border-box;
    overflow-wrap: break-word;
    word-wrap: break-word;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ErrorBlock: FC<Props> = ({ texts }) => (
    <>
        {texts.map((msg, idx) => (
            <StyledErrorBlock key={idx}>{msg || DEFAULT_ERROR}</StyledErrorBlock>)
        )}
    </>
);

export { ErrorBlock };
