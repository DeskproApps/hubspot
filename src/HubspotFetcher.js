import {
  generic_validator,
} from './util';

function properties_validator({ required, valid }) {
  const validate = generic_validator({ required, valid });
  return ({ body }) => {
    let name_a;
    try {
      const property_a = body.properties;
      if (!property_a) {
        throw new Error("No .properties in .body");
      }
      name_a = property_a.map(({ name }) => name);
      let property_o = {};
      property_a.forEach(({ name, value }) => property_o[name] = value);
      if (!required.every((name) => property_o[name])) {
        const message = "Required property without a value";
        console.warn(message, { required, property_o });
        throw new Error(message)
      }
    } catch (e) {
      return {
        failed: true,
        reason: e,
      }
    }

    return validate({ name_a });
  }
}

const validate_association = ({ id, body }) => {
  if (id) { throw new Error("Doesn't accept any id"); }
  if (!body instanceof Array) {
    throw new Error("body should be an Array");
  }
  if (!body.every((obj) => (
    Object.keys(obj).sorted().join("-")) ===
    "category-definitionId-fromObjectId-toObjectId"
  )) {
    const message = "Wrong object shape";
    console.warn(message, body);
    throw new Error(message);
  }
};

/**
 * HubspotFetcher allows performing API request on Hubspot API
 */
class HubspotFetcher {
  static contact_to_deal_defintion_id = 4
  static contact_to_engagement_defintion_id = 9
  static association_url = (id, definition_id) =>
    `/crm-associations/v1/associations/${id}/HUBSPOT_DEFINED/${definition_id}`

  constructor(props) {
    const {
      base = "https://api.hubapi.com",
      fetch_f = fetch,
      query_string = {},
      option = {},
    } = props;
    this._props = {
      base,
      fetch_f,
      query_string,
      option,
    };
  }

  derive = (props) => {
    return new HubspotFetcher({
      ...this._props,
      ...props,
    })
  }

  _fetch = (params) => {
    const { base, query_string, fetch_f } = this._props;
    const { url, body } = params;
    const url_o = new URL(base + url);
    Object.keys(query_string).forEach(key => {
      url_o.searchParams.append(key, query_string[key]);
    });
    const option = { ...this._props.option };
    if (body) {
      option.body = body;
    }
    return fetch_f(url_o, option)
  }

  _json = (params) => {
    return this._fetch({
      ...params,
    }).then(r => r.json());
  }

  _hubspot_GET = (url) => {
    return this._json({ url, method: "GET" });
  }

  _hubspot_POST(url, { body }) {
    return this._json({ url, method: "POST", body });
  }

  _hubspot_PUT(url, { body }) {
    return this._json({ url, method: "PUT", body });
  }

  ////
  //// HUBSPOT
  ////
  //
  // GET
  //
  contact_by_email = (email) => {
    return this._hubspot_GET(`/contacts/v1/contact/email/${email}/profile`)
  }

  deal = (dealId) => {
    return this._hubspot_GET(`/deals/v1/deal/${dealId}`)
  }

  engagement = (engagementId) => {
    return this._hubspot_GET(`/engagements/v1/engagements/${engagementId}`)
  }

  dealId_by_contact = (contactId) => {
    return this._hubspot_GET(
      HubspotFetcher.association_url(
        contactId,
        HubspotFetcher.contact_to_deal_defintion_id
      )
    )
  }

  engagementId_by_contact = (contactId) => {
    return this._hubspot_GET(
      HubspotFetcher.association_url(
        contactId,
        HubspotFetcher.contact_to_engagement_defintion_id,
      )
    )
  }

  all_owners = () => {
    return this._hubspot_GET("/owners/v2/owners/")
  }

  all_companies_paged = () => {
    return this._hubspot_GET("/companies/v2/companies/paged")
  }

  //
  // POST
  //
  create_deal = (() => {
    const required = "dealname".split(" ");
    const valid = [].concat(
      "pipeline dealstage amount closedate".split(" "),
      "hubspot_owner_id dealtype".split(" "),
    )

    const create_deal = function ({ body }) {
      properties_validator({ required, valid })({ body })

      return this._hubspot_POST(`/deals/v1/deal/`, { body })
    }

    create_deal.all_property_a = [].concat(valid, required)

    return create_deal;
  })()

  create_engagement({ body }) {
    return this._hubspot_POST(`/engagements/v1/engagements/`, { body })
  }

  //
  // PUT
  //
  update_deal({ dealId, body }) {
    return this._hubspot_PUT(`/deals/v1/deal/${dealId}`, { body })
  }

  update_engagement({ engagementId, body }) {
    return this._hubspot_PUT(
      `/engagements/v1/engagements/${engagementId}`,
      { body },
    )
  }

  create_association_batch({ body }) {
    validate_association({ body })
    return this._hubspot_PUT(
      "/crm-associations/v1/associations/create-batch",
      { body },
    )
  }

  delete_association_batch({ body }) {
    validate_association({ body })
    return this._hubspot_PUT(
      "/crm-associations/v1/associations/delete-batch",
      { body },
    )
  }
}


export {
  HubspotFetcher,
};
