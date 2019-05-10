import React from "react";
import PropTypes from "prop-types";
import { XList } from "../component";

const NoteList = ({ note_json_a }) => (<XList
  iter={note_json_a}
  callback={(value) => [
    { key: value.engagement.id },
    value.engagement.bodyPreview,
  ]}
 />);

NoteList.propTypes = {
  note_json_a: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { NoteList };
