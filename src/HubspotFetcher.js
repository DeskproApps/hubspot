import { genericValidator } from "./util";

function propertiesValidator({ required, valid }) {
  const validate = genericValidator({ required, valid });
  return ({ body }) => {
    let nameA;
    try {
      const propertyA = body.properties;
      if (!propertyA) {
        throw new Error("No .properties in .body");
      }
      nameA = propertyA.map(({ name }) => name);
      const propertyO = {};
      propertyA.forEach(({ name, value }) => {
        propertyO[name] = value;
      });
      if (!required.every((name) => propertyO[name])) {
        const message = "Required property without a value";
        console.warn(message, { required, propertyO });
        throw new Error(message);
      }
    } catch (e) {
      return {
        failed: true,
        reason: e,
      };
    }

    return validate({ nameA });
  };
}

const validateAssociation = ({ id, body }) => {
  if (id) {
    throw new Error("Doesn't accept any id");
  }
  if (!(body instanceof Array)) {
    throw new Error("body should be an Array");
  }
  if (
    !body.every(
      (obj) =>
        Object.keys(obj)
          .sorted()
          .join("-") === "category-definitionId-fromObjectId-toObjectId"
    )
  ) {
    const message = "Wrong object shape";
    console.warn(message, body);
    throw new Error(message);
  }
};

/**
 * HubspotFetcher allows performing API request on Hubspot API
 */
class HubspotFetcher {
  static contactToDealDefintionId = 4;
  static contactToEngagementDefintionId = 9;
  static associationUrl = (id, definitionId) =>
    `/crm-associations/v1/associations/${id}/HUBSPOT_DEFINED/${definitionId}`;

  constructor(props) {
    const {
      base = "https://api.hubapi.com",
      fetchF = fetch,
      queryString = {},
      option = {},
    } = props;
    this.Props = {
      base,
      fetchF,
      queryString,
      option,
    };
  }

  derive = (props) => {
    return new HubspotFetcher({
      ...this.Props,
      ...props,
    });
  };

  Fetch = (params) => {
    const { base, queryString, fetchF } = this.Props;
    const { url, body } = params;
    const urlO = new URL(base + url);
    Object.keys(queryString).forEach((key) => {
      urlO.searchParams.append(key, queryString[key]);
    });
    const option = { ...this.Props.option };
    if (body) {
      option.body = body;
    }
    return fetchF(urlO, option);
  };

  _json = (params) => {
    return this.Fetch({
      ...params,
    }).then((r) => r.json());
  };

  _hubspot_GET = (url) => {
    return this._json({ url, method: "GET" });
  };

  _hubspot_POST(url, { body }) {
    return this._json({ url, method: "POST", body });
  }

  _hubspot_PUT(url, { body }) {
    return this._json({ url, method: "PUT", body });
  }

  // //
  // // HUBSPOT
  // //
  //
  // GET
  //
  accountDetail = () => {
    return this._hubspot_GET("/integrations/v1/me");
  };

  contactByEmail = (email) => {
    return this._hubspot_GET(`/contacts/v1/contact/email/${email}/profile`);
  };

  deal = (dealId) => {
    return this._hubspot_GET(`/deals/v1/deal/${dealId}`);
  };

  engagement = (engagementId) => {
    return this._hubspot_GET(`/engagements/v1/engagements/${engagementId}`);
  };

  dealIdByContact = (contactId) => {
    return this._hubspot_GET(
      HubspotFetcher.associationUrl(
        contactId,
        HubspotFetcher.contactToDealDefintionId
      )
    );
  };

  engagementIdByContact = (contactId) => {
    return this._hubspot_GET(
      HubspotFetcher.associationUrl(
        contactId,
        HubspotFetcher.contactToEngagementDefintionId
      )
    );
  };

  allOwners = () => {
    return this._hubspot_GET("/owners/v2/owners/");
  };

  allCompaniesPaged = () => {
    return this._hubspot_GET("/companies/v2/companies/paged");
  };

  //
  // POST
  //
  createDeal = (() => {
    const required = "dealname".split(" ");
    const valid = [].concat(
      "pipeline dealstage amount closedate".split(" "),
      "hubspotOwnerId dealtype".split(" ")
    );

    const createDeal = ({ body }) => {
      propertiesValidator({ required, valid })({ body });

      return this._hubspot_POST("/deals/v1/deal/", { body });
    };

    createDeal.requiredA = required;
    createDeal.validA = valid;
    createDeal.allPropertyA = [].concat(valid, required);

    return createDeal;
  })();

  createEngagement({ body }) {
    return this._hubspot_POST("/engagements/v1/engagements/", { body });
  }

  //
  // PUT
  //
  updateDeal({ dealId, body }) {
    const { requiredA: required, validA: valid } = HubspotFetcher.createDeal;
    console.assert(dealId);

    propertiesValidator({ required, valid })({ body });

    return this._hubspot_PUT(`/deals/v1/deal/${dealId}`, { body });
  }

  updateEngagement({ engagementId, body }) {
    return this._hubspot_PUT(`/engagements/v1/engagements/${engagementId}`, {
      body,
    });
  }

  createAssociationBatch({ body }) {
    validateAssociation({ body });
    return this._hubspot_PUT("/crm-associations/v1/associations/create-batch", {
      body,
    });
  }

  deleteAssociationBatch({ body }) {
    validateAssociation({ body });
    return this._hubspot_PUT("/crm-associations/v1/associations/delete-batch", {
      body,
    });
  }
}

export { HubspotFetcher };
