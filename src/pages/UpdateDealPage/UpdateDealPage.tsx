import { FC, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useSetAppTitle, useLoadUpdateDealDeps } from "../../hooks";
import { updateDealService } from "../../services/hubspot";
import { queryClient } from "../../query";
import { UpdateDeal } from "../../components";
import { isValidationError } from "../../services/hubspot/utils";
import type { Deal, HubSpotError } from "../../services/hubspot/types";
import type { FormValues } from "../../components/common/Builder";

const UpdateDealPage: FC = () => {
    const { dealId } = useParams<{ dealId: Deal["id"] }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string|null>(null);
    const { client } = useDeskproAppClient();
    const { deal, dealMeta, isLoading } = useLoadUpdateDealDeps(dealId);

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

    const onSubmit = useCallback((values: FormValues) => {
        if (!client || !dealId) {
            return Promise.resolve();
        }

        setError(null);

        return updateDealService(client, dealId, values)
            .then(() =>  queryClient.invalidateQueries())
            .then(() => navigate(`/deal/${dealId}`))
            .catch((err: HubSpotError) => {
                if (isValidationError(err)) {
                    setError(err.message);
                } else {
                    throw err;
                }
            });
    }, [client, dealId, navigate]);

    const onCancel = useCallback(() => navigate(`/deal/${dealId}`), [navigate, dealId]);

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <UpdateDeal
            error={error}
            deal={deal}
            dealMeta={dealMeta}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
};

export { UpdateDealPage };
