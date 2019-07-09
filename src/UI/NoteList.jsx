import React from "react";
import PropTypes from "prop-types";
import { XList } from "../component";

const NoteList = ({ noteFilteredA }) => {
  return (<XList
    iter={noteFilteredA}
    callback={(value) => {
    return {
      key: value.engagement.id,
      children: value.engagement.bodyPreview,
    };
  }}
 />);
};

NoteList.propTypes = {
  noteFilteredA: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { NoteList };
