import { FC } from "react";
import styled from "styled-components";
import ReactTimeAgo from "react-time-ago";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@deskpro/deskpro-ui";
import { H3, P1, P11, Stack, HorizontalDivider } from "@deskpro/app-sdk";
import {
    Title,
    BaseContainer
} from "../common";

const notes = [
    { id: 0, name: "Java Script", date: "10 mos", title: "Note Title", link: "https://github.com/zpawn", note: "The user was particularly interested in purchasing the Deskpro Premium." }
];

const TimeAgo = styled(ReactTimeAgo)`
  color: ${({ theme }) => theme.colors.grey80};
`;

const Author = styled(Stack)`
  width: 35px;
`;

const NoteBlock = styled(P1)`
  width: calc(100% - 35px);

  p {
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  img {
    width: 100%;
    height: auto;
  }
`;

const Note: FC<{
    id: number, name: string, date: string, title: string, link: string, note: string,
}> = ({ title, link, name, note }) => (
    <>
        <Title as={H3} title={title} link={link} />
        <Stack wrap="nowrap" gap={6} style={{ marginBottom: 14 }}>
            <Author vertical align="center">
                <Avatar size={18} name={name} backupIcon={faUser} />
                <P11>
                    <TimeAgo date={new Date()} timeStyle="mini" />
                </P11>
            </Author>
            <NoteBlock>{note}</NoteBlock>
        </Stack>
    </>
);

const Notes: FC = () => (
    <>
        <BaseContainer>
            <Title title="Notes (1)" onClick={() => {}} />
            {notes.map((note) => (
                <Note key={note.id} {...note} />
            ))}
        </BaseContainer>
        <HorizontalDivider/>
    </>
);

export { Notes };
