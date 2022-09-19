import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import {
    LoadingSpinner,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { Home } from "./pages/Home";

function App() {
    useInitialisedDeskproAppClient((client) => {
        client?.registerElement("refreshButton", {
            type: "refresh_button"
        });
    });

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <Routes>
                <Route path="/" element={<Home/>} />
            </Routes>
        </Suspense>
    );
}

export default App;
