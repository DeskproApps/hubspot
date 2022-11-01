import { FC } from "react";
import styled from "styled-components";
import { Label as UILabel } from "@deskpro/app-sdk";
import { Props } from "./types";

const Label: FC<Props> = styled(UILabel)`
    margin-bottom: ${({ marginBottom = 10 }: Props) => marginBottom}px;
`;

export { Label };
