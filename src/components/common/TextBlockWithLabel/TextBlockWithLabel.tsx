import { isValidElement, ReactElement } from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { DeskproTheme, P5, P8, Stack } from '@deskpro/deskpro-ui';

export interface ITextBlockWithLabel {
    marginBottom?: number;
    label?: string | ReactElement;
    text?: string | number | ReactElement;
    isHTML?: boolean;
};

const HTMLContent = styled.div`
    font-size: 11px;
`;

const Container = styled.div<ITextBlockWithLabel>`
    margin-bottom: ${({ marginBottom }) => `${marginBottom}px`};
`;

const Label = styled(P8)`
    color: ${({ theme }) => (theme as DeskproTheme).colors.grey80};
`;

function sanitiseHTML(text: string | number | ReactElement) {
    const sanitisedHTML = DOMPurify.sanitize(String(text));

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitisedHTML;

    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
        link.target = '_blank';
    });

    return tempDiv.innerHTML;
};

export function TextBlockWithLabel({ marginBottom = 10, label, text, isHTML }: ITextBlockWithLabel) {
    let textBlock: ReactElement | null = null;

    if (isHTML && text) {
        const sanitisedHTML = sanitiseHTML(text);

        textBlock = <HTMLContent dangerouslySetInnerHTML={{__html: sanitisedHTML}} />
    } else if (typeof text === 'string' || typeof text === 'number'){
        textBlock = <P5>{text}</P5>
    } else if (isValidElement(text)) {
        textBlock = <Stack gap={5} align='baseline'>{text}</Stack>
    };
    
    return (
        <Container marginBottom={marginBottom}>
            {label && <Label>{label}</Label>}
            {textBlock}
        </Container>
    );
};