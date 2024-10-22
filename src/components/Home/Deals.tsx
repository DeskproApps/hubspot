import { useMemo, Fragment } from "react";
import { useNavigate, createSearchParams, Link as RouterLink } from "react-router-dom";
import {
    Link,
    Title,
    HorizontalDivider,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { isLast, getScreenStructure } from "../../utils";
import {
    NoFound,
    HubSpotLogo,
    BaseContainer,
    BlocksBuilder,
} from "../common";
import { blocksMap } from "../blocks";
import type { FC } from "react";
import type { ContextData, Settings } from "../../types";
import type {
    Company,
    Contact,
    AccountInto,
    PropertyMeta,
    Deal as DealType,
} from "../../services/hubspot/types";

type Props = {
    deals: Array<DealType["properties"]>;
    accountInfo?: AccountInto;
    contact: Contact["properties"];
    companies: Array<Company["properties"]>;
    dealMetaMap: Record<PropertyMeta["name"], PropertyMeta>;
};

type DealProps = {
    isLast: boolean;
    accountInfo?: AccountInto;
    deal: DealType["properties"];
    dealMetaMap: Record<PropertyMeta["name"], PropertyMeta>;
};

const Deal: FC<DealProps> = ({ deal, dealMetaMap, isLast, accountInfo }) => {
    const portalId = accountInfo?.portalId;
    const dealId = deal.hs_object_id;
    const { context } = useDeskproLatestAppContext<ContextData, Settings>();
    const structure = useMemo(() => {
        let layout = getScreenStructure(context?.settings, "deal", "list");

        if (layout[0].length === 1 && layout[0][0] === "dealname") {
            layout = [...layout.slice(1)];
        }

        return layout;
    }, [context?.settings]);

    return (
        (
            <Fragment key={dealId}>
                <Title
                    title={<Link as={RouterLink} to={`/deal/${dealId}`}>{deal.dealname}</Link>}
                    marginBottom={0}
                    {...((portalId && dealId)
                        ? {
                            link: `https://app.hubspot.com/contacts/${portalId}/deal/${dealId}`,
                            icon: <HubSpotLogo/>
                        }
                        : {}
                    )}
                />
                <BlocksBuilder
                    type="deals"
                    config={{ structure, metaMap: dealMetaMap }}
                    blocksMap={blocksMap}
                    values={deal}
                />
                {!isLast && <HorizontalDivider style={{ marginBottom: 8 }}/>}
            </Fragment>
        )
    );
};

const Deals: FC<Props> = ({
    deals,
    accountInfo,
    contact: { hs_object_id: contactId },
    companies,
    dealMetaMap,
}) => {
    const navigate = useNavigate();
    const portalId = accountInfo?.portalId;
    const companyId = companies[0]?.hs_object_id || null;

    return (
        <>
            <BaseContainer>
                <Title
                    title={`Deals (${deals.length})`}
                    {...(portalId
                        ? {
                            link: `https://app.hubspot.com/contacts/${portalId}/deals`,
                            icon: <HubSpotLogo/>
                        }
                        : {}
                    )}
                    onClick={() => navigate({
                        pathname: `/deal/create`,
                        search: `?${createSearchParams({
                            contactId,
                            ...(!companyId ? {} : { companyId }),
                        }).toString()}`
                    })}
                />
                {deals.length === 0
                    ? <NoFound text="No deals found" />
                    : deals.map((deal, idx) => (
                        <Deal
                            deal={deal}
                            key={deal.hs_object_id}
                            accountInfo={accountInfo}
                            dealMetaMap={dealMetaMap}
                            isLast={isLast(deals, idx)}
                        />
                    ))
                }
            </BaseContainer>
            <HorizontalDivider/>
        </>
    );
};

export { Deals };
