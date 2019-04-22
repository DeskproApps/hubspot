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
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    ...option,
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
      .forEach(([method_name, url_f]) => {
        this[method_name] = ({id, option = {}}) => {
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
  contact_by_email:
    (email) => `/contacts/v1/contact/email/${email}/profile`,

  deal:
    (dealId) => `/deals/v1/deal/${dealId}`,

  engagement:
    (engagementId) => `/engagements/v1/engagements/${engagementId}`,

  dealId_by_contact:
    (contactId) => association_url(contactId, contact_to_deal_defintion_id),

  engagementId_by_contact:
    (contactId) => association_url(contactId, contact_to_engagement_defintion_id),
}

Fetcher.method_POST_a = {
  create_deal:
    () => `/deals/v1/deal/`,
  update_deal:
    (dealId) => `/deals/v1/deal/${dealId}`,

  create_engagement:
    () => `/engagements/v1/engagements/`,
  update_engagement:
    (engagementId) => `/engagements/v1/engagements/${engagementId}`,
}

export {
  Fetcher
};
