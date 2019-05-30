/* eslint-disable react/jsx-closing-tag-location */
import React from "react";
import PropTypes from "prop-types";

function CreateNewDealLink({ enable_create_deal, callback_f }) {
  return (
    // eslint-disable-next-line
    <div className="dealLinkDiv"><a
      {...(enable_create_deal ? {} : { disabled: true })}
      onClick={() => {
        if (enable_create_deal) {
          callback_f();
        }
      }}>
        Create new deal
    </a></div>);
}

CreateNewDealLink.propTypes = {
  enable_create_deal: PropTypes.bool.isRequired,
  callback_f: PropTypes.func.isRequired,
};

export { CreateNewDealLink };
