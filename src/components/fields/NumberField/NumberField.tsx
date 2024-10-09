import styled from "styled-components";
import { Icon } from "@deskpro/deskpro-ui";
import { useQueryWithClient } from "../../../hooks";
import { getAccountInfoService } from "../../../services/hubspot";
import { QueryKey } from "../../../query";
import { getCurrencySymbol } from "../../../utils";
import { Input } from "../../common";
import type { FC } from "react";
import type { FieldProps } from "../../common/Builder";

const Container = styled.div<{ isCurrency: boolean }>`
    width: ${({ isCurrency }) => (isCurrency ? "calc(100% - 21px)" : '100%')};
`;

const NumberField: FC<FieldProps<string>> = ({ meta, formControl }) => {
    const isCurrency = Boolean(meta.showCurrencySymbol);
    const fieldName = formControl.field.name;

    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
        { enabled: isCurrency },
    );


    return (
        <Container isCurrency={isCurrency}>
            <Input
                type="number"
                id={fieldName}
                {...(isCurrency ? {
                    leftIcon: (
                        <Icon
                            icon={<>{getCurrencySymbol(accountInfo.data?.companyCurrency)}</>}
                            themeColor="grey40"
                        />
                    )
                } : {})}
                {...formControl.field}
            />
        </Container>
    );
};

export { NumberField };
