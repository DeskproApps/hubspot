import { FC, ComponentType, ReactNode } from "react";
import styled   from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { H1, Stack, Button } from "@deskpro/app-sdk";
import { HubSpotLink } from "../HubSpotLink";

type Props = {
    title: string | ReactNode,
    link?: string,
    onClick?: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    as?: ComponentType<any>|string|any,
    marginBottom?: number,
};

const Heading = styled(H1)`
    width: calc(100% - 50px);
`;

const Title: FC<Props> = ({ title, link, onClick, as = H1, marginBottom = 14 }) => {
    return (
        <Stack align="center" justify="space-between" gap={6} style={{ marginBottom }}>
            <Heading as={as}>
                {title}&nbsp;
                {onClick && (
                    <Button icon={faPlus} minimal noMinimalUnderline onClick={onClick}/>
                )}
            </Heading>
            {link && <HubSpotLink href={link} />}
        </Stack>
    );
};

export { Title };
