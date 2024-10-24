import { FC } from "react";
import { useParams } from "react-router-dom";
import { useDeskproElements } from "@deskpro/app-sdk";
import { useSetAppTitle } from "../../hooks";
import { useLoadDealDeps } from "./hooks";
import { Deal } from "../../components/Deal";
import { Loading, BaseContainer } from "../../components/common";

const DealPage: FC = () => {
    const { dealId } = useParams();
    const {
        deal,
        contacts,
        companies,
        isLoading,
        accountInfo,
        dealMetaMap,
    } = useLoadDealDeps(dealId);
    const { portalId } = accountInfo;

    useSetAppTitle("Deal details");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");

        registerElement("home", { type: "home_button", payload: { type: "changePage", path: `/home` }});
        registerElement("edit", { type: "edit_button", payload: { type: "changePage", path: `/deal/update/${dealId}` }});
    }, [dealId, portalId]);

    if (isLoading) {
        return (
            <BaseContainer>
                <Loading/>
            </BaseContainer>
        );
    }

    return (
        <Deal
            accountInfo={accountInfo}
            deal={deal}
            contacts={contacts}
            companies={companies}
            dealMetaMap={dealMetaMap}
        />
    );
};

export { DealPage };
