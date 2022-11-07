import { FC, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
} from "@deskpro/app-sdk";
import { useSetAppTitle } from "../../hooks";
import { useLoadActivityDeps } from "./hooks";
import { ActivityForm } from "../../components/ActivityForm";
import {
    ErrorBlock,
} from "../../components/common";
import type { Values } from "../../components/ActivityForm/types";

const CreateActivityPage: FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const contactId = searchParams.get("contactId") || undefined;
    const {
        isLoading,
        dealOptions,
        contactOptions,
        companyOptions,
        callDirectionOptions,
        callDispositionOptions,
    } = useLoadActivityDeps(contactId);

    const [error, setError] = useState<string|null>(null);

    useSetAppTitle("Log activity");

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

    const onSubmit = (values: Values) => {
        console.log(">>> activity:submit:", values);

        setError(null);

        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    };

    const onCancel = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <>
            {error && <ErrorBlock text={error}/>}
            <ActivityForm
                initValues={{ contactId } as { contactId: string }}
                dealOptions={dealOptions}
                companyOptions={companyOptions}
                contactOptions={contactOptions}
                callDirectionOptions={callDirectionOptions}
                callDispositionOptions={callDispositionOptions}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </>
    );
};

export { CreateActivityPage };
