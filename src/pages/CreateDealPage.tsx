import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useSetAppTitle } from "../hooks";
import { DealForm } from "../components";
import type { Values } from "../components/DealForm/types";

const CreateDealPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();

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

        console.log(">>> deal:create:submit:", values);
    };

    const onCancel = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    return (
        <DealForm
            initValues={{

            }}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
};

export { CreateDealPage };
