import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";
// for tests in Jest, because these observers arn't available in the Node environment
import "intersection-observer";
// todo: check after the removal `iframe-resizer` if it is still needed
// for tests in Jest, because these observers arn't available in the Node environment
import ResizeObserver from "resize-observer-polyfill";
import { useQuery } from "@tanstack/react-query";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TextDecoder, TextEncoder } from "util";
import * as React from "react";
import { lightTheme } from "@deskpro/deskpro-ui";
import { mockClient, mockUserContext } from "@deskpro/app-testing-utils";
import type { IDeskproClient, DeskproAppEventHooks } from "@deskpro/app-sdk";
import type { UserContext } from "./src/types";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextEncoder = TextEncoder;
//for some reason the types are wrong, but this works
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextDecoder = TextDecoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.React = React;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
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
