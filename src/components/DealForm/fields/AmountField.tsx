import { FC } from "react";
import styled from "styled-components";
import { InputWithDisplay } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { Label } from "../../common";

const StyledLabel = styled(Label)`
    width: calc(100% - 21px);
`;

const AmountField: FC<{
    currency: string,
    error: boolean,
}> = ({ currency, ...props }) => {
    const { theme } = useDeskproAppTheme();
    return (
        <StyledLabel htmlFor="amount" label="Amount">
            <InputWithDisplay
                id="amount"
                type="text"
                inputsize="small"
                placeholder="Enter value"
                leftIcon={(<span style={{ color: theme.colors.grey100 }}>{currency}</span>)}
                {...props}
            />
        </StyledLabel>
    );
};

export { AmountField };
