import React from "react";
import PropTypes from "prop-types";

import {
  DataList,
} from "@deskpro/apps-components";

import * as d3 from "d3-format";

const CompanyDataList = ({ getter }) => {
  return (<DataList data={[
    ["Domain name", getter("domain")],
    ["Industry", getter("industry")],
    ["Annual Revenue",
      getter("annualrevenue") ?
        d3.format(".3s")(getter("annualrevenue")) :
        "",
    ],
  ].map(([label, value]) => ({ label, value }))
  }
   />);
};

CompanyDataList.propTypes = {
  getter: PropTypes.func.isRequired,
};

export { CompanyDataList };
