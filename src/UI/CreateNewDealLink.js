/** @jsx jsx */
import { jsx } from '@emotion/core';

import { disabled_link_css } from '../css';

export function CreateNewDealLink({ enable_create_deal, callback_f }) {
  return <div css={{
    textAlign: "right",
  }}><a css={{
    ...(enable_create_deal ? {} : disabled_link_css),
    textDecoration: "underline",
  }} onClick={() => {
    if (enable_create_deal) {
      callback_f();
    }
  }}>Create new deal</a></div>;
}
