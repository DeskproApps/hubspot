import { LoadingSpinner, useDeskproElements } from "@deskpro/app-sdk";
import { Button } from "@deskpro/deskpro-ui";
import { useState, useEffect } from "react";
// import { tryToLinkAutomatically } from "../utils";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

const LoadingAppPage = () => {
    useDeskproElements(({ registerElement, clearElements }) => {
        clearElements()
        registerElement("refresh", { type: "refresh_button" });
    });

    const [errorState, setErrorState] = useState<string | null>(null)

    useEffect(() => {
        if (errorState === "left") {
            throw new Error("Hello from HubSpot")
        }

        if (errorState === "right") {
            throw "HI from HubSpot"
        }
    }, [errorState])

    return (
        <>
            <Button
                text="Left Error"
                onClick={() => { setErrorState("left") }}
            />
            <Button
                text="Right Error"
                onClick={() => { setErrorState("right") }}
            />
            <LoadingSpinner />
        </>
    );
};

export { LoadingAppPage };
