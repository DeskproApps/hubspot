import { useMemo } from "react";
import { P5 } from "@deskpro/deskpro-ui";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { getAccountInfoService } from "../../../services/hubspot";
import { QueryKey } from "../../../query";
import { formatPrice } from "../../../utils";
import type { FC } from "react";
import type { BlockProps } from "../../common/Builder";

type Props = BlockProps<string>;

const NumberBlock: FC<Props> = ({ meta, value }) => {
    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
    );

    const price = useMemo(() => formatPrice(value, {
        style: meta.showCurrencySymbol ? "currency" : "decimal",
        currency: accountInfo.data?.companyCurrency,
    }), [value, meta.showCurrencySymbol, accountInfo.data?.companyCurrency]);

    return (
        <P5>{price}</P5>
    );
};

export { NumberBlock };
