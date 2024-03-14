import { FC } from "react";
import styled from "styled-components";
import { Stack } from "@deskpro/deskpro-ui";
import { Props } from "./types";

const StyledErrorBlock = styled(Stack)`
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.red100};
  margin-bottom: 8px !important;
  padding: 4px 6px !important;
  border-radius: 4px;
  font-size: 12px;
  width: 100%;
`;

export const ErrorBlock: FC<Props> = ({ text = "An error occurred" }) => (
    <StyledErrorBlock>
        {Array.isArray(text)
            ? text.map((msg, idx) => (<div key={idx}>{msg}</div>))
            : text
        }
    </StyledErrorBlock>
);
