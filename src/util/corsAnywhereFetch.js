/* eslint-disable quotes */

/**
 * corsFetch
 * Use the cors-anywhere proxy for the given request
 *
 * @param url the target url
 * @param option the fetch options, except mode and headers
 */
// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
const corsAnywhereFetch = ({ fetchF = fetch }) => (url, init = {}) => {
  const urlO = new URL(url);
  if (urlO.protocol !== "https:") {
    throw new Error(
      `corsAnywhereFetch expects https only - not "${urlO.protocol}"`
    );
  }
  if (init.mode && init.mode !== "cors") {
    throw new Error(
      `corsAnywhereFetch expects { mode: "cors" } only - not "${init.mode}"`
    );
  }
  if (init.headers) {
    const ctType = init.headers["Content-Type"];
    if (ctType && ctType !== "application/json") {
      throw new Error(
        `corsAnywhereFetch expects { "Content-Type": "application/json" }` +
          ` only - not "${ctType}"`
      );
    }
  }

  const corsUrl =
    `https://cors-anywhere.herokuapp.com/` +
    `${urlO.hostname}:443${urlO.pathname}${urlO.search}`;

  const { headers } = init;

  const option = {
    ...init,
    mode: "cors",
    headers: { ...headers, "Content-Type": "application/json" },
  };

  return fetchF(corsUrl, option);
};

export { corsAnywhereFetch };
