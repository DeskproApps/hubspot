import React from 'react';
import { XList } from '../component';

export const NoteList = ({ note_json_a }) => <XList
  iter={note_json_a}
  callback={(value) => [
    { key: value.engagement.id },
    value.engagement.bodyPreview
  ]}
></XList>;
