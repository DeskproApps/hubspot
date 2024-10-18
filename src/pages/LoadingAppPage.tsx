import { LoadingSpinner, useDeskproElements } from "@deskpro/app-sdk";
import { useCheckLinkedContact } from "../hooks";

const LoadingAppPage = () => {
    useDeskproElements(({ registerElement }) => {
        registerElement("refresh", { type: "refresh_button" });
    });

    useCheckLinkedContact();

    return (
        <LoadingSpinner/>
    );
};

export { LoadingAppPage };
