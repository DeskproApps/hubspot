import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDeskproElements } from "@deskpro/app-sdk";
import { useSetAppTitle } from "../hooks";
import { NoteForm } from "../components";
import { BaseContainer} from "../components/common";
import type { Values } from "../components/NoteForm/types";

const CreateNotePage: FC = () => {
    const navigate = useNavigate();

    useSetAppTitle("Add note");

    useDeskproElements(({ deRegisterElement, registerElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("refresh");
        deRegisterElement("externalLink");
        deRegisterElement("edit");

        registerElement("home", {
            type: "home_button",
            payload: { type: "changePage", path: `/home` },
        });
    });

    const onSubmit = (values: Values) => {
        //...
    };

    const onCancel = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    return (
        <BaseContainer>
            <NoteForm onSubmit={onSubmit} onCancel={onCancel} />
        </BaseContainer>
    );
};

export { CreateNotePage };
