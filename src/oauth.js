import React from "react";
import PropTypes from "prop-types";

import { Panel } from "@deskpro/apps-components";

// OAuth 2

const oauth = {
  // "dev oauth integration dp"
  clientId: "ba933fa1-14d1-4f38-af70-b45343a3192a"
};

const redirect_uri = "http://localhost:3000/dev.html";

function makeOauthlink({ addNocsrfF }) {
  const url = new URL("https://app.hubspot.com/oauth/authorize");
  const nocsrf = Math.random()
    .toString(36)
    .substring(2);
  addNocsrfF(nocsrf);
  const queryStringParam = {
    responseType: "code",
    clientId: oauth.clientId,
    redirect_uri,
    scope: "contacts", // space separated
    state: nocsrf
  };
  Object.keys(queryStringParam).forEach(key => {
    url.searchParams.append(key, queryStringParam[key]);
  });
  return url;
}

const OauthPanel = ({ oauthNocsrfAState, oauthCodeState }) => {
  let oauthNocsrfA = oauthNocsrfAState.get();
  if (!(oauthNocsrfA instanceof Array)) {
    oauthNocsrfA = [];
  }
  const addNocsrfF = nocsrf => {
    oauthNocsrfA.push(nocsrf);
    if (oauthNocsrfA.length > 10) {
      oauthNocsrfA.unshif();
    }
    oauthNocsrfAState.set(oauthNocsrfA);
  };

  const children = [
    // eslint-disable-next-line
    <a
      key="a"
      onClick={async () => {
        console.log("click!");
        window.top.location.href = makeOauthlink({ addNocsrfF });
      }}
    >
      Authenticate with OAuth
    </a>
  ];

  const search = new URL(window.top.location.href).searchParams;
  const code = search.get("code");
  const nocsrf = search.get("state");
  if (nocsrf || code) {
    if (oauthNocsrfA.indexOf(nocsrf) !== -1) {
      console.log("Receiving!");
      children.push(<div key="r">Receiving oauth code</div>);
      oauthCodeState.set(code);
    } else {
      console.log("Failing!", { nocsrf, oauthNocsrfA });
      children.push(<div key="f">Oauth failed</div>);
    }
  }

  return <Panel>{children}</Panel>;
};

OauthPanel.propTypes = {
  oauthNocsrfAState: PropTypes.shape({
    get: PropTypes.func,
    set: PropTypes.func
  }).isRequired,
  oauthCodeState: PropTypes.shape({ get: PropTypes.func }).isRequired
};

export { makeOauthlink, OauthPanel };
