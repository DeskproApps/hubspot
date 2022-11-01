import { FC } from "react";
import { useDeskproElements } from "@deskpro/app-sdk";
import { useSetAppTitle } from "../../hooks";

const CreateNotePage: FC = () => {
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

    return (
        <>
            CreateNotePage
        </>
    );
};

export { CreateNotePage };
