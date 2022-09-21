import { FC } from "react";
import {
    Button as ButtonUI,
    ButtonProps,
    AnchorButton as AnchorButtonUI,
    AnchorButtonProps,
} from "@deskpro/deskpro-ui";
import styled from "styled-components";

export const Button: FC<ButtonProps> = styled(ButtonUI)`
    min-width: 72px;
    justify-content: center;
`;

export const AnchorButton: FC<AnchorButtonProps> = styled(AnchorButtonUI)`
    min-width: 72px;
    justify-content: center;
`;
