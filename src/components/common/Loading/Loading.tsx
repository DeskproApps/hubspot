import { FC } from "react";
import { Spinner, SpinnerProps } from "@deskpro/deskpro-ui";
import { Stack } from "@deskpro/app-sdk";

const Loading: FC<SpinnerProps> = (props) => (
    <Stack justify="center">
        <Spinner {...props} />
    </Stack>
);

export { Loading };
