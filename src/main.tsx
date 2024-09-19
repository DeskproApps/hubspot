import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Scrollbar } from "@deskpro/deskpro-ui";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import { queryClient } from "./query";
import { AppProvider } from "./hooks";
import App from "./App";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/fonts/DpIcons/dp-icon-v2.css";
import "./main.css";
import "simplebar/dist/simplebar.min.css";

TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render((
    <React.StrictMode>
        <Scrollbar style={{ height: "100%", width: "100%" }}>
            <DeskproAppProvider>
                <AppProvider>
                    <DndProvider backend={HTML5Backend}>
                        <HashRouter>
                            <QueryClientProvider client={queryClient}>
                                <App/>
                            </QueryClientProvider>
                        </HashRouter>
                    </DndProvider>
                </AppProvider>
            </DeskproAppProvider>
        </Scrollbar>
    </React.StrictMode>
));
