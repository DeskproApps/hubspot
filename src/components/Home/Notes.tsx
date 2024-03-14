import { FC } from "react";
import styled from "styled-components";
import get from "lodash/get";
import ReactTimeAgo from "react-time-ago";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { P1, P11, Stack, Avatar } from "@deskpro/deskpro-ui";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { getFullName } from "../../utils";
import { Title, BaseContainer } from "../common";

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
  
  p:first-child {
    margin-top: 0;
  }

  img {
    width: 100%;
    height: auto;
  }
`;

type OwnerProps = {
    id: string,
    firstName: string,
    lastName: string,
};

type NoteProps = {
    hs_object_id: string,
    hs_note_body: string,
    hs_lastmodifieddate: string,
    hubspot_owner_id: OwnerProps["id"],
};

type Props = {
    notes: Array<NoteProps>,
    owners: Record<OwnerProps["id"], OwnerProps>,
    onCreateNote: () => void,
};

const Note: FC<NoteProps & { owner?: OwnerProps }> = ({
    hs_note_body,
    hs_lastmodifieddate,
    owner,
}) => (
    <Stack wrap="nowrap" gap={6} style={{ marginBottom: 14 }}>
        <Author vertical align="center">
            <Avatar size={18} name={getFullName(owner)} backupIcon={faUser} />
            <P11>
                <TimeAgo date={new Date(hs_lastmodifieddate)} timeStyle="mini" />
            </P11>
        </Author>
        <NoteBlock dangerouslySetInnerHTML={{ __html: hs_note_body }}/>
    </Stack>
);

const Notes: FC<Props> = ({ notes, owners, onCreateNote }) => (
    <>
        <BaseContainer>
            <Title title={`Notes (${notes.length})`} onClick={onCreateNote} />
            {notes.map((note) => (
                <Note key={note.hs_object_id} {...note} owner={get(owners, [note?.hubspot_owner_id], undefined)} />
            ))}
        </BaseContainer>
        <HorizontalDivider/>
    </>
);

export { Notes };
