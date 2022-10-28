import { FC } from "react";
import { useDeskproElements } from "@deskpro/app-sdk";

const UpdateDealPage: FC = () => {
    useDeskproElements(({ deRegisterElement }) => {
        deRegisterElement("home");
        deRegisterElement("menu");
        deRegisterElement("edit");
        deRegisterElement("externalLink");
    });

    return (
        <>
            UpdateDealPage
        </>
    );
};

export { UpdateDealPage };
