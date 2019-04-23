import { generic_validator } from './util';

function validator({ required, valid }) {
  const validate = generic_validator({ required, valid });
  return ({ option }) => {
    let name_a;
    try {
      const property_a = option.body.properties;
      if (!property_a) {
        throw new Error("No .properties in .body");
      }
      name_a = property_a.map(({ name }) => name);
    } catch (e) {
      return {
        failed: true,
        reason: e,
      }
    }

    return validate({ name_a });
  }
}

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
  constructor({fetch_f = fetch, qs = {}, option = {}}) {
    this.fetch_f = fetch_f;
    this.qs = qs;
    this.option = option;
    ["GET", "POST"].forEach(method => {
      Object.entries(Fetcher[`method_${method}_a`])
      .forEach(([method_name, { url: url_f, validation_f }]) => {
        this[method_name] = (params) => {
          if (validation_f) {
            const validation = validation_f(params);
            if (validation.failed) {
              return Promise.reject(method_name, "option validation failed:", validation.reason);
            }
          }
          const {id, option = {}} = params;
          return cors_fetch(
            this.fetch_f,
            base + url_f(id),
            this.qs,
            { ...this.option, ...option, method },
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
 * @type {[[method_name, method_url_function]]}
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
}

Fetcher.method_POST_a = {
  create_deal: {
    url: () => `/deals/v1/deal/`,
    validation_f: validator({
      required: "dealname dealtype".split(" "),
      valid: "dealstage pipeline hubspot_owner_id closedate amount".split(" "),
    }),
  },
  update_deal: {
    url: (dealId) => `/deals/v1/deal/${dealId}`,
  },

  create_engagement: {
    url: () => `/engagements/v1/engagements/`,
  },
  update_engagement: {
    url: (engagementId) => `/engagements/v1/engagements/${engagementId}`,
  },
}

export {
  Fetcher
};
