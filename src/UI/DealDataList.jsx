import React from "react";
import PropTypes from "prop-types";

import {
  DataList,
} from "@deskpro/apps-components";

const DealDataList = ({ getter }) => {
  return (<DataList data={[
      ["Pipeline", getter("pipeline")],
      ["Stage", getter("dealstage")],
    ].map(([label, value]) => ({ label, value }))
    } />);
};

DealDataList.propTypes = {
  getter: PropTypes.func.isRequired,
};

export { DealDataList };
