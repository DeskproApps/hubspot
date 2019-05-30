import React from "react";
import PropTypes from "prop-types";
import { XList } from "../component";

const NoteList = ({ note_filtered_a }) => (<XList
  iter={note_filtered_a}
  callback={(value) => {
    return {
      key: value.engagement.id,
      children: value.engagement.bodyPreview,
    };
  }}
 />);

NoteList.propTypes = {
  note_filtered_a: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { NoteList };
