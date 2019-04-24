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
      property_a.forEach(({name, value}) => property_o[name] = value);
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

const validate_association = ({id, body}) => {
  if (id) { throw new Error("Doesn't accept any id"); }
  if (!body instanceof Array) {
    throw new Error ("body should be an Array");
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
 * cors_fetch
 * Use the cors-anywhere proxy for the given request
 *
 * @param {function} fetch_f what function to use in place of fetch
 * @param {string} base_url the target url
 * @param {Object} query_string_param -- will be append to the url
 * @param {Object} option the fetch options, except mode and headers
 */
function cors_fetch(fetch_f, base_url, query_string_param, option) {
  base_url = new URL(base_url);
  if (base_url.protocol !== "https:") {
    throw new Error(
      `cors_fetch expects https only - not "${base_url.protocol}"`
    );
  }

  const url = new URL(
    `https://cors-anywhere.herokuapp.com/` +
    `${base_url.hostname}:443${base_url.pathname}${base_url.search}`
  );
  Object.keys(query_string_param).forEach(key => {
    url.searchParams.append(key, query_string_param[key]);
  });

  option = {
    ...option,
    mode: "cors",
    headers: { "Content-Type": "application/json" },
  }

  return fetch_f(url, option);
}

/**
 * Fetcher allows performing API request on Hubspot API
 * See "Fetcher_methods"
 */
class Fetcher { // es-lint-disable
  constructor({fetch_f = fetch, qs = {}, options = {}}) {
    this.fetch_f = fetch_f;
    this.qs = qs;
    this.options = options;
    ["GET", "POST", "PUT"].forEach(method => {
      Object.entries(Fetcher[`method_${method}_a`])
      .forEach(([method_name, method_value]) => {
        const { url: url_f, validation_f } = method_value;
        this[method_name] = (params) => {

          if (validation_f) {
            const validation = validation_f(params);
            if (validation.failed) {
              return Promise.reject(
                new Error(method_name + " validation failed: " + validation.reason)
              );
            }
          }

          const {id, body = null, options = {}} = params;
          const union_options = { ...this.options, ...options, method };
          if (body) {
            union_options.body = JSON.stringify(body);
          }

          return cors_fetch(
            this.fetch_f,
            base + url_f(id),
            this.qs,
            union_options,
          ).then(r => r.json());

        };
      });
    });
  }
}

const base = "https://api.hubapi.com";
const contact_to_deal_defintion_id = 4;
const contact_to_engagement_defintion_id = 9;
const association_url = (id, definition_id) =>
  `/crm-associations/v1/associations/${id}/HUBSPOT_DEFINED/${definition_id}`;

/**
 * Fetcher_methods
 * @type {[[method_name, {url: function, validation_f: function, }]]}
 */
/**
 * method_url_function
 * @type {(string) -> string}
 * @description function which returns the path part of the API url
 */
Fetcher.method_GET_a = {
  contact_by_email: {
    url: (email) => `/contacts/v1/contact/email/${email}/profile`,
  },

  deal: {
    url: (dealId) => `/deals/v1/deal/${dealId}`,
  },

  engagement: {
    url: (engagementId) => `/engagements/v1/engagements/${engagementId}`,
  },

  dealId_by_contact: {
    url: (contactId) => association_url(contactId, contact_to_deal_defintion_id),
  },

  engagementId_by_contact: {
    url: (contactId) => association_url(contactId, contact_to_engagement_defintion_id),
  },

  all_owners: {
    url: () => `/owners/v2/owners/`,
  },

  all_companies_paged: {
    url: () => `/companies/v2/companies/paged`,
  },
};



Fetcher.method_POST_a = {
  create_deal: (() => {
    const required = "dealname".split(" ");
    const valid = [].concat(
      "pipeline dealstage amount closedate".split(" "),
      "hubspot_owner_id dealtype".split(" "),
    )

    return {
      url: () => `/deals/v1/deal/`,
      validation_f: properties_validator({ required, valid }),
      required_property_a: required,
      valid_property_a: valid,
      all_property_a: required.concat(valid),
    }
  })(),

  create_engagement: {
    url: () => `/engagements/v1/engagements/`,
  },
};


Fetcher.method_PUT_a = {
  update_deal: {
    url: (dealId) => `/deals/v1/deal/${dealId}`,
  },

  update_engagement: {
    url: (engagementId) => `/engagements/v1/engagements/${engagementId}`,
  },

  create_association_batch: {
    url: () => "/crm-associations/v1/associations/create-batch",
    validation_f: validate_association,
  },

  delete_association_batch: {
    url: () => "/crm-associations/v1/associations/delete-batch",
    validation_f: validate_association,
  },
};


export {
  Fetcher,
};
