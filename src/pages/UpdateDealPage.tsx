import { FC, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useSetAppTitle, useLoadUpdateDealDeps } from "../hooks";
import { updateDealService } from "../services/hubspot";
import { queryClient, QueryKey } from "../query";
import { ErrorBlock } from "../components/common";
import { DealForm } from "../components";
import { getDealValues } from "../components/DealForm/utils";
import { isValidationError } from "../services/hubspot/utils";
import type { Deal, HubSpotError } from "../services/hubspot/types";
import type { Values } from "../components/DealForm/types";

const UpdateDealPage: FC = () => {
    const { dealId } = useParams<{ dealId: Deal["id"] }>();
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const {
        deal,
        currency,
        pipelines,
        isLoading,
        ownerOptions,
        dealTypeOptions,
        priorityOptions,
    } = useLoadUpdateDealDeps(dealId);

    const [error, setError] = useState<string|null>(null);

    useSetAppTitle("Edit deal");

    useDeskproElements(({ deRegisterElement, registerElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");

        registerElement("home", {
            type: "home_button",
            payload: { type: "changePage", path: `/home` },
        });
    });

    const onSubmit = (values: Values) => {
        if (!client || !dealId) {
            return Promise.resolve();
        }

        setError(null);

        return updateDealService(client, dealId, getDealValues(values))
            .then(() =>  queryClient.refetchQueries([QueryKey.DEALS, dealId]))
            .then(() => navigate(`/deal/${dealId}`))
            .catch((err: HubSpotError) => {
                if (isValidationError(err)) {
                    setError(err.message);
                } else {
                    throw err;
                }
            });
    };

    const onCancel = useCallback(() => {
        navigate(`/deal/${dealId}`);
    }, [navigate, dealId]);

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <>
            {error && <ErrorBlock texts={[error]}/>}
            <DealForm
                isEditMode
                initValues={{
                    name: deal?.dealname,
                    amount: deal?.amount,
                    pipelineId: deal?.pipeline,
                    dealStageId: deal?.dealstage,
                    closeDate: deal?.closedate,
                    ownerId: deal?.hubspot_owner_id,
                    dealTypeId: deal?.dealtype,
                    priorityId: deal?.hs_priority,
                }}
                onSubmit={onSubmit}
                onCancel={onCancel}
                pipelines={pipelines}
                currency={currency}
                ownerOptions={ownerOptions}
                dealTypeOptions={dealTypeOptions}
                priorityOptions={priorityOptions}
            />
        </>
    );
};

export { UpdateDealPage };
