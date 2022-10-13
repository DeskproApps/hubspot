import { FC } from "react";
import { useParams } from "react-router-dom";
import { useDeskproElements } from "@deskpro/app-sdk";
import { getDealService } from "../services/hubspot";
import {
    useSetAppTitle,
    useQueryWithClient,
} from "../hooks";
import { QueryKey } from "../query";
import { Deal } from "../components/Deal";
import { Loading, BaseContainer } from "../components/common";
import type { Deal as DealType } from "../services/hubspot/types";

const DealPage: FC = () => {
    const { dealId } = useParams();
    const { data, isSuccess, isFetched } = useQueryWithClient(
        [QueryKey.DEALS, dealId],
        (client) => getDealService(client, dealId as string),
        { enabled: !!dealId },
    );

    useSetAppTitle("Deal details");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("menu");
        registerElement("home", { type: "home_button", payload: { type: "changePage", path: `/home` }});
    });

    if (!dealId || !isFetched && !isSuccess) {
        return (
            <BaseContainer>
                <Loading/>
            </BaseContainer>
        );
    }

    return (
        <Deal deal={data?.properties as DealType["properties"]} />
    );
};

export { DealPage };
