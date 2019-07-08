/* eslint-disable react/jsx-closing-tag-location */
import React from "react";
import PropTypes from "prop-types";

function CreateNewDealLink({ enableCreateDeal, callbackF }) {
  return (
    // eslint-disable-next-line
    <div className="dealLinkDiv"><a
      {...(enableCreateDeal ? {} : { disabled: true })}
      onClick={() => {
        if (enableCreateDeal) {
          callbackF();
        }
      }}>
        Create new deal
    </a></div>);
}

CreateNewDealLink.propTypes = {
  enableCreateDeal: PropTypes.bool.isRequired,
  callbackF: PropTypes.func.isRequired,
};

export { CreateNewDealLink };
