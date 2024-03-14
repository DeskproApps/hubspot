import { FC } from "react";
import { Stack, Spinner, SpinnerProps } from "@deskpro/deskpro-ui";

const Loading: FC<SpinnerProps> = (props) => (
    <Stack justify="center">
        <Spinner {...props} />
    </Stack>
);

export { Loading };
