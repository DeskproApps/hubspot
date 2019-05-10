import React from "react";
import PropTypes from "prop-types";

import { access } from "../util";
import { XList } from "../component";
import { DealDataList } from ".";


const DealList = ({
  render_head,
  deal_index_a, deal_a, value_getter,
}) => (
  <React.Fragment>
    <XList
      render_head={render_head}
      iter={deal_index_a}
      callback={(index) => {
      const get_d = value_getter(access(deal_a, `${index}.properties`, {}), "");
      return [{
        key: index,
        title: get_d("dealname"),
      }, <DealDataList key={index} getter={get_d} />];
    }}
   />
  </React.Fragment>);

DealList.propTypes = {
  render_head: PropTypes.func.isRequired,
  deal_index_a: PropTypes.arrayOf(PropTypes.number).isRequired,
  deal_a: PropTypes.arrayOf(PropTypes.object).isRequired,
  value_getter: PropTypes.func.isRequired,
};

export { DealList };
