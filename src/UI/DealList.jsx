/** @jsx jsx */
import { jsx } from '@emotion/core';

import React from 'react';

import { access } from '../util';
import { XList } from '../Component';
import { DealDataList } from '.';


const DealList = ({ deal_index_a, deal_a, value_getter, create_deal_callback_f }) => <React.Fragment>
  <XList
    render_head={() => <div
      css={{
        textAlign: "right",
      }}
    ><a
      css={{
        textDecoration: "underline",
      }}
      onClick={create_deal_callback_f}
      >Create new deal</a></div>
    }
    iter={deal_index_a}
    callback={(index) => {
      const get_d = value_getter(access(deal_a, `${index}.properties`, {}), "");
      return [{
        key: index,
        title: get_d("dealname"),
      }, <DealDataList key={index} getter={get_d}></DealDataList>];
    }}
  ></XList>
</React.Fragment>;

export { DealList };
