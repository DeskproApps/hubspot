import React from "react";
import PropTypes from "prop-types";

import {
  Button,
} from "@deskpro/apps-components";

import { XList } from "../component";
import { DealDataList } from ".";


const DealList = ({
  render_head,
  currency,
  edit,
  deal_filtered_a, value_getter,
}) => {
  return <XList
    render_head={render_head}
    iter={deal_filtered_a}
    callback={(deal, k) => {
      const get_d = value_getter(deal.properties);
      const { dealId } = deal;
      const amount = `${get_d("amount_in_home_currency")} ${currency}`;
      return {
        key: k,
        pannelProps: { title: get_d("dealname") },
        children: <DealDataList getter={get_d} currency={currency} />,
        top_right: () => <span className="amount">{amount}</span>,
        bottom_right: () => <Button
          className="edit"
          onClick={edit(dealId)}
        >Edit</Button>,
      };
  }}
  />;
};

DealList.propTypes = {
  edit: PropTypes.func.isRequired,
  render_head: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  deal_filtered_a: PropTypes.arrayOf(PropTypes.object).isRequired,
  value_getter: PropTypes.func.isRequired,
};

export { DealList };
