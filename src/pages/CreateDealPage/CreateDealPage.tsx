import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { createDealService, setEntityAssocService } from "../../services/hubspot";
import { isValidationError } from "../../services/hubspot/utils";
import { useSetAppTitle, useLoadUpdateDealDeps } from "../../hooks";
import { queryClient } from "../../query";
import { CreateDeal } from "../../components";
import type { FC } from "react";
import type { HubSpotError } from "../../services/hubspot/types";
import type { FormValues } from "../../components/common/Builder";

const CreateDealPage: FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { client } = useDeskproAppClient();
    const { isLoading, dealMeta } = useLoadUpdateDealDeps();

    const [error, setError] = useState<string|null>(null);

    const contactId = searchParams.get("contactId") || undefined;
    const companyId = searchParams.get("companyId") || undefined;

    useSetAppTitle("Create new deal");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
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
        if (!client) {
            return;
        }

        setError(null);

        return createDealService(client, values)
            .then((deal) => Promise.all([
                contactId
                    ? setEntityAssocService(client, "deals", deal.id, "contacts", contactId, "deal_to_contact")
                    : Promise.resolve(),
                companyId
                    ? setEntityAssocService(client, "deals", deal.id, "companies", companyId, "deal_to_company")
                    : Promise.resolve(),
            ]))
            .then(() => queryClient.invalidateQueries())
            .then(() => navigate("/home"))
            .catch((err: HubSpotError) => {
                if (isValidationError(err)) {
                    setError(err.message);
                } else {
                    throw err;
                }
            });
    }, [client, contactId, companyId, navigate]);

    const onCancel = useCallback(() => navigate("/home"), [navigate]);

    if (isLoading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <CreateDeal
            dealMeta={dealMeta}
            error={error}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
};

export { CreateDealPage };
