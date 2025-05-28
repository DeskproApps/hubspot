import { FC } from "react";
import { match } from "ts-pattern";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Button, Stack } from "@deskpro/deskpro-ui";
import { DeskproError } from "../../../services/hubspot";
import { BaseContainer } from "../Layout";
import { ErrorBlock } from "./ErrorBlock";
import { FallbackRender } from "@sentry/react";

const ErrorFallback: FallbackRender = ({ resetError, error }) => {
  let message = "There was an error!";
  let nativeErrorMessage = (error as Error).message;

  if (error instanceof DeskproError) {
    const { code, entity, message: msg } = error;
    nativeErrorMessage = msg;

    message = match(code)
      .with(401, () => "Access token invalid, please fix in admin settings")
      .with(403, () => `Please ensure that the app has been granted all necessary permissions in HubSpot`)
      .with(404, () => `Can't find ${entity ? entity : ""}`)
      .otherwise(() => "There was an error!");
  }

  // eslint-disable-next-line no-console
  console.error(nativeErrorMessage);

  return (
    <BaseContainer>
      <ErrorBlock
        texts={[(
          <Stack gap={6} vertical style={{ padding: "8px" }}>
            {message}
            <Button text="Reload" icon={faRefresh} intent="secondary" onClick={resetError} />
          </Stack>
        )]}
      />
    </BaseContainer>
  )
}

export { ErrorFallback };
