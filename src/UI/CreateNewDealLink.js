/* eslint-disable react/jsx-closing-tag-location */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";

import { disabled_link_css } from "../css";

function CreateNewDealLink({ enable_create_deal, callback_f }) {
  return (
    <div css={{
      textAlign: "right",
      // eslint-disable-next-line
    }}><a
      css={{
        ...(enable_create_deal ? {} : disabled_link_css),
        textDecoration: "underline",
      }}
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
