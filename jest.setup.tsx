import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";
// for tests in Jest, because these observers arn't available in the Node environment
import "intersection-observer";
// for tests in Jest, because these observers arn't available in the Node environment
import ResizeObserver from "resize-observer-polyfill";
import { useQuery } from "@tanstack/react-query";
import { TextDecoder, TextEncoder } from "util";
import * as React from "react";
import { lightTheme } from "@deskpro/deskpro-ui";
import { mockClient, mockUserContext } from "@deskpro/app-testing-utils";
import type { IDeskproClient, DeskproAppEventHooks } from "@deskpro/app-sdk";
import type { UserContext } from "./src/types";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.React = React;
global.ResizeObserver = ResizeObserver;

let currentContext = mockUserContext as UserContext;

export const setCurrentContext = (context: UserContext) => {
    currentContext = context;
};

jest.mock("@deskpro/app-sdk", () => ({
    ...jest.requireActual("@deskpro/app-sdk"),
    useDeskproAppClient: () => ({ client: mockClient }),
    useDeskproAppEvents: (
        hooks: DeskproAppEventHooks,
        deps = []
    ) => {
        React.useEffect(() => {
            !!hooks.onChange && hooks.onChange(currentContext);
            !!hooks.onShow && hooks.onShow(currentContext);
            !!hooks.onReady && hooks.onReady(currentContext);
            !!hooks.onAdminSettingsChange && hooks.onAdminSettingsChange(currentContext.settings);
            /* eslint-disable-next-line react-hooks/exhaustive-deps */
        }, deps);
    },
    useInitialisedDeskproAppClient: (callback: (param: typeof mockClient) => void) => {
        callback(mockClient);
    },
    useDeskproLatestAppContext: () => ({ context: currentContext }),
    useDeskproAppTheme: () => ({ theme: lightTheme }),
    proxyFetch: async () => fetch,
    LoadingSpinner: () => <>Loading...</>,
    useQueryWithClient: (
        queryKey: string[],
        queryFn: (client: IDeskproClient) => Promise<void>,
        options: object,
    ) => useQuery(queryKey, () => queryFn(mockClient as never), options),
}));
