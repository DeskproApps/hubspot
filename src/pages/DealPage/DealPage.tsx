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
        owner,
        pipeline,
        contacts,
        companies,
        dealTypes,
        isLoading,
        accountInfo,
    } = useLoadDealDeps(dealId);
    const { portalId } = accountInfo;

    useSetAppTitle("Deal details");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");

        registerElement("externalLink", {
            type: "cta_external_link",
            hasIcon: true,
            url: `https://app.hubspot.com/contacts/${portalId}/deal/${dealId}`,
        });
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
            dealTypes={dealTypes}
            deal={deal}
            pipeline={pipeline}
            owner={owner}
            contacts={contacts}
            companies={companies}
        />
    );
};

export { DealPage };
