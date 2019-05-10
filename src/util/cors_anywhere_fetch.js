
/**
 * cors_fetch
 * Use the cors-anywhere proxy for the given request
 *
 * @param url the target url
 * @param option the fetch options, except mode and headers
 */
// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
const cors_anywhere_fetch = ({ fetch_f = fetch }) => (url, init = {}) => {
  const url_o = new URL(url);
  if (url_o.protocol !== "https:") {
    throw new Error(
      `cors_anywhere_fetch expects https only - not "${url_o.protocol}"`
    );
  }
  if (init.mode && init.mode !== "cors") {
    throw new Error(
      `cors_anywhere_fetch expects { mode: "cors" } only - not "${init.mode}"`
    )
  }
  if (init.headers) {
    const ct_type = init.headers["Content-Type"]
    if (ct_type && ct_type !== "application/json") {
      throw new Error(
        `cors_anywhere_fetch expects { "Content-Type": "application/json" }` +
        ` only - not "${ct_type}"`
      )
    }
  }

  const cors_url =
    `https://cors-anywhere.herokuapp.com/` +
    `${url_o.hostname}:443${url_o.pathname}${url_o.search}`;

  const { headers } = init;

  const option = {
    ...init,
    mode: "cors",
    headers: { ...headers, "Content-Type": "application/json" },
  };

  return fetch_f(cors_url, option);
}

export { cors_anywhere_fetch }
