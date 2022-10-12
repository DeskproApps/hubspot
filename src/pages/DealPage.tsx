import { FC } from "react";
import { useParams } from "react-router-dom";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useDeskproElements } from "@deskpro/app-sdk";
import {
    getDealService,
    getOwnerService,
    getPipelineService,
    getDealTypesService,
    getAccountInfoService,
} from "../services/hubspot";
import {
    useSetAppTitle,
    useQueryWithClient,
} from "../hooks";
import { QueryKey } from "../query";
import { Deal } from "../components/Deal";
import { Loading, BaseContainer } from "../components/common";
import type { Deal as DealType, Pipeline } from "../services/hubspot/types";

const DealPage: FC = () => {
    const { dealId } = useParams();

    const deal = useQueryWithClient<DealType>(
        [QueryKey.DEALS, dealId],
        (client) => getDealService(client, dealId as string),
        { enabled: !!dealId },
    );

    const pipeline = useQueryWithClient<Pipeline>(
        [QueryKey.PIPELINES, "deals", deal.data?.properties.pipeline],
        (client) => getPipelineService(client, "deals", deal.data?.properties.pipeline as string),
        { enabled: !!deal.data?.properties.pipeline }
    );

    const accountInfo = useQueryWithClient(
        [QueryKey.ACCOUNT_INFO],
        getAccountInfoService,
    );

    const owner = useQueryWithClient(
        [QueryKey.OWNERS, get(deal, ["data", "properties", "hubspot_owner_id"], 0)],
        (client) =>  getOwnerService(client, get(deal, ["data", "properties", "hubspot_owner_id"], 0)),
        { enabled: !!get(deal, ["data", "properties", "hubspot_owner_id"], 0) }
    );

    const dealTypes = useQueryWithClient([QueryKey.DEALS, "types"], getDealTypesService);

    useSetAppTitle("Deal details");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("menu");
        registerElement("home", { type: "home_button", payload: { type: "changePage", path: `/home` }});
    });

    if (!dealId || !deal.isFetched && !deal.isSuccess || isEmpty(deal.data) || isEmpty(pipeline.data)) {
        return (
            <BaseContainer>
                <Loading/>
            </BaseContainer>
        );
    }

    return (
        <Deal
            accountInfo={accountInfo.data}
            dealTypes={dealTypes.data}
            deal={deal.data?.properties}
            pipeline={pipeline.data}
            owner={owner?.data}
        />
    );
};

export { DealPage };
