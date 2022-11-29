import { useCallback } from "react";
import styled from "styled-components";
import {
    P1,
    Radio,
    Stack,
    useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { OverflowText } from "../common";
import type { FC } from "react";
import type { Contact } from "../../services/hubspot/types";

type Props = Contact & {
    checked: boolean,
    onChange: (contactId: Contact["id"]) => void,
};

const UserInfo = styled(P1)`
    width: calc(100% - 12px - 6px);
    margin-top: -3px;
    cursor: pointer;
`;

const ContactLabel: FC<Props["properties"] & { onClick: () => void }> = ({ firstname, lastname, email, onClick }) => {
    const { theme } = useDeskproAppTheme();

    return (
        <UserInfo onClick={onClick}>
            <OverflowText>{firstname} {lastname}</OverflowText>
            {email && (
                <OverflowText style={{ color: theme.colors.grey80 }}>
                    &lt;{email}&gt;
                </OverflowText>
            )}
        </UserInfo>
    );
};

const ContactItem: FC<Props> = ({
    id,
    checked,
    onChange,
    properties,
}) => {
    const onChangeSelection = useCallback(() => {
        onChange(id)
    }, [id, onChange]);
    return (
        <Stack align="start" justify="start" gap={6} style={{ margin: "10px 0" }}>
            <Radio value={id} checked={checked} onChange={onChangeSelection} />
            <ContactLabel {...properties} onClick={onChangeSelection} />
        </Stack>
    );
}

export { ContactItem };
