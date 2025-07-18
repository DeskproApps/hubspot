import { ComponentType, ReactNode } from 'react';
import styled from 'styled-components';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ExternalIconLink } from '@deskpro/app-sdk';
import { AnyIcon, Button, H1, Stack } from '@deskpro/deskpro-ui';

interface Title {
    title: string | ReactNode;
    as?: ComponentType<unknown> | string;
    icon?: AnyIcon;
    link?: string;
    marginBottom?: number;
    onClick?: () => void;
};

const Heading = styled(H1)``;

function Title({
    title,
    as,
    icon,
    link,
    marginBottom = 14,
    onClick
}: Title) {
    return (
        <Stack align='center' justify='space-between' gap={6} style={{ marginBottom }}>
            <Heading {...(as ? { as } : {})}>
                {title}&nbsp;
                {onClick && (
                    <Button icon={faPlus} minimal noMinimalUnderline onClick={onClick} />
                )}
            </Heading>
            {link && <ExternalIconLink href={link} icon={icon} />}
        </Stack>
    );
};

export default Title;