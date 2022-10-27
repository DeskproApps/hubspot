import { FC, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { createDealService/*, setEntityAssocService*/ } from "../services/hubspot";
import { isValidationError } from "../services/hubspot/utils";
import { useSetAppTitle, useLoadUpdateDealDeps } from "../hooks";
import { ErrorBlock } from "../components/common";
import { DealForm } from "../components";
import { getDealValues } from "../components/DealForm/utils";
import type { Values } from "../components/DealForm/types";

const CreateDealPage: FC = () => {
    const navigate = useNavigate();
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
    } = useLoadUpdateDealDeps();

    const [error, setError] = useState<string|null>(null);

    useSetAppTitle("Create new deal");

    useDeskproElements(({ registerElement, deRegisterElement }) => {
        deRegisterElement("menu");
        deRegisterElement("editButton");

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
            // .then((deal) => {
            //     return Promise.all([
            //         setEntityAssocService(client, "deals", deal.id, "contacts", values.contact.value),
            //         setEntityAssocService(client, "deals", deal.id, "companies", values.company.value),
            //     ]);
            // })
            .then(() => navigate("/home"))
            .catch((err) => {
                if (isValidationError(err)) {
                    setError(err.message);
                } else {
                    throw new Error(err);
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
        <>
            {error && <ErrorBlock text={error}/>}
            <DealForm
                initValues={{}}
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
        </>
    );
};

export { CreateDealPage };
