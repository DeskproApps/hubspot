import { FC } from "react";
import { match } from "ts-pattern";
import { FallbackProps } from "react-error-boundary";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Button, Stack } from "@deskpro/app-sdk";
import { DeskproError } from "../../../services/hubspot";
import { BaseContainer } from "../Layout";
import { ErrorBlock } from "./ErrorBlock";

type Props = Omit<FallbackProps, "error"> & {
    error: Error | DeskproError,
};

const errorFallbackRender: FC<Props> = ({ resetErrorBoundary, error }) => {
    let message = "There was an error!";
    let nativeErrorMessage = error.message;

    if (error instanceof DeskproError) {
        const { code, entity, message: msg } = error;
        nativeErrorMessage = msg;

        message = match(code)
            .with(403, () => `Please ensure that the app has been granted all necessary permissions in HubSpot`)
            .with(404, () => `Can't find ${entity ? entity : ""}`)
            .otherwise(() => "There was an error!");
    }

    // eslint-disable-next-line no-console
    console.error(nativeErrorMessage);

    return (
        <BaseContainer>
            <ErrorBlock
                text={(
                    <Stack gap={6} vertical style={{ padding: "8px" }}>
                        {message}
                        <Button text="Reload" icon={faRefresh} intent="secondary" onClick={resetErrorBoundary} />
                    </Stack>
                )}
            />
        </BaseContainer>
    )
}

export { errorFallbackRender };
