import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";

const useSetAppTitle = (title: string): void => {
    useInitialisedDeskproAppClient((client) => {
        client.setTitle(title)
    }, [title]);
};

export { useSetAppTitle };
