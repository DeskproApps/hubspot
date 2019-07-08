import React from "react";
import PropTypes from "prop-types";

import {
  Button,
} from "@deskpro/apps-components";

import { XList } from "../component";
import { DealDataList } from ".";


const DealList = ({
  renderHead,
  currency,
  edit,
  dealFilteredA, valueGetter,
}) => {
  return <XList
    renderHead={renderHead}
    iter={dealFilteredA}
    callback={(deal, k) => {
      const getD = valueGetter(deal.properties);
      const { dealId } = deal;
      const amount = `${getD("amountIn_home_currency")} ${currency}`;
      return {
        key: k,
        pannelProps: { title: getD("dealname") },
        children: <DealDataList getter={getD} currency={currency} />,
        topRight: () => <span className="amount">{amount}</span>,
        bottomRight: () => <Button
          className="edit"
          onClick={edit(dealId)}
        >Edit</Button>,
      };
  }}
  />;
};

DealList.propTypes = {
  edit: PropTypes.func.isRequired,
  renderHead: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  dealFilteredA: PropTypes.arrayOf(PropTypes.object).isRequired,
  valueGetter: PropTypes.func.isRequired,
};

export { DealList };
