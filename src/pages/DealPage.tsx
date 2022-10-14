import { FC } from "react";
import { useParams } from "react-router-dom";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useDeskproElements } from "@deskpro/app-sdk";
import {
    getDealService,
    getOwnerService,
    getContactService,
    getCompanyService,
    getPipelineService,
    getDealTypesService,
    getAccountInfoService,
    getEntityAssocService,
} from "../services/hubspot";
import {
    useSetAppTitle,
    useQueryWithClient,
    useQueriesWithClient,
} from "../hooks";
import { filterEntities } from "../utils";
import { QueryKey } from "../query";
import { Deal } from "../components/Deal";
import { Loading, BaseContainer } from "../components/common";
import type {Deal as DealType, Pipeline, Contact, Company, Owner} from "../services/hubspot/types";

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

    const contactIds = useQueryWithClient(
        [QueryKey.ENTITY, "deals", dealId, "contacts"],
        (client) => getEntityAssocService<Contact["id"], "deal_to_contact">(client, "deals", dealId as string, "contacts"),
        { enabled: !!dealId },
    );

    const contacts = useQueriesWithClient(contactIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.CONTACT, id],
        queryFn: (client) => getContactService(client, id),
        enabled: (contactIds.data?.results.length > 0),
    })) ?? []);

    const companyIds = useQueryWithClient(
        [QueryKey.ENTITY, "deals", dealId, "companies"],
        (client) => getEntityAssocService<Company["id"], "deal_to_company">(client, "deals", dealId as string, "companies"),
        { enabled: !!dealId }
    );

    const companies = useQueriesWithClient(companyIds.data?.results?.map(({ id }) => ({
        queryKey: [QueryKey.CONTACT, id],
        queryFn: (client) => getCompanyService(client, id),
        enabled: (companyIds.data?.results.length > 0),
    })) ?? []);

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
            owner={owner?.data as Owner|undefined}
            contacts={filterEntities(contacts)}
            companies={filterEntities(companies)}
        />
    );
};

export { DealPage };
