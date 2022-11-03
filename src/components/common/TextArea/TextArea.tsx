import styled from "styled-components";
import {
    TextAreaWithDisplay,
    TextAreaWithDisplayProps,
} from "@deskpro/deskpro-ui";

type Props = TextAreaWithDisplayProps & {
    minWidth?: number | string | "auto",
};

const TextArea = styled(TextAreaWithDisplay)<Props>`
    min-height: ${({ minWidth = 100 }) => typeof minWidth === "number" ? `${minWidth}px` : minWidth};
    font-size: 11px;
    font-family: ${({ theme }) => theme.fonts.primary};
`;

export { TextArea };
