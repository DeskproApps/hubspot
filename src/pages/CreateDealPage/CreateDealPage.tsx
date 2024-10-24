import { FC, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { createDealService, setEntityAssocService } from "../../services/hubspot";
import { isValidationError } from "../../services/hubspot/utils";
import { useSetAppTitle, useLoadUpdateDealDeps } from "../../hooks";
import { queryClient, QueryKey } from "../../query";
import { CreateDeal } from "../../components";
import { getDealValues } from "../../components/DealForm/utils";
import type { HubSpotError } from "../../services/hubspot/types";
import type { Values } from "../../components/DealForm/types";

const CreateDealPage: FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { client } = useDeskproAppClient();
    const {
        ownerOptions,
        currency,
        contactOptions,
        companyOptions,
        isLoading,
        pipelines,
        dealTypeOptions,
        priorityOptions,
        dealMeta,
    } = useLoadUpdateDealDeps();

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

    const onSubmit = async (values: Values) => {
        if (!client) {
            return;
        }

        setError(null);

        return createDealService(client, getDealValues(values))
            .then((deal) => {
                return Promise.all([
                    values.contact.value
                        ? setEntityAssocService(client, "deals", deal.id, "contacts", values.contact.value, "deal_to_contact")
                        : Promise.resolve(),
                    values.company.value
                        ? setEntityAssocService(client, "deals", deal.id, "companies", values.company.value, "deal_to_company")
                        : Promise.resolve(),
                ]);
            })
            .then(() => queryClient.refetchQueries([QueryKey.DEALS_BY_CONTACT_ID, contactId]))
            .then(() => navigate("/home"))
            .catch((err: HubSpotError) => {
                if (isValidationError(err)) {
                    setError(err.message);
                } else {
                    throw err;
                }
            });
    };

    const onCancel = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    if (isLoading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <CreateDeal
            dealMeta={dealMeta}
            error={error}
            initValues={{ contactId, companyId }}
            onSubmit={onSubmit}
            onCancel={onCancel}
            pipelines={pipelines}
            currency={currency}
            ownerOptions={ownerOptions}
            dealTypeOptions={dealTypeOptions}
            priorityOptions={priorityOptions}
            contactOptions={contactOptions}
            companyOptions={companyOptions}
        />
    );
};

export { CreateDealPage };
