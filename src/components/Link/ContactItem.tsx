import type { FC, ChangeEvent } from "react";
import {
    P1,
    Radio,
    Label,
    Stack,
    useDeskproAppTheme,
} from "@deskpro/app-sdk";
import type { Contact } from "../../services/hubspot/types";

type Props = Contact & {
    checked: boolean,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
};

const ContactLabel: FC<Props["properties"]> = ({ firstname, lastname, email }) => {
    const { theme } = useDeskproAppTheme();

    return (
        <>
            <P1>{firstname} {lastname}</P1>
            {email && (
                <P1 style={{ color: theme.colors.grey80 }}>
                    &lt;{email}&gt;
                </P1>
            )}
        </>
    );
};

const ContactItem: FC<Props> = ({
    id,
    checked,
    onChange,
    properties,
}) => (
    <Stack key={id} align="start" justify="start" gap={6} style={{ marginBottom: 5 }}>
        <Label htmlFor={`contact-${id}`}>
            <Radio
                value={id}
                checked={checked}
                onChange={onChange}
                id={`contact-${id}`}
                label={
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    (<ContactLabel {...properties} />) as string
                }
            />
        </Label>
    </Stack>
);

export { ContactItem };
