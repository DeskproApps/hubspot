import React from 'react';

import {
  Panel
} from '@deskpro/apps-components';

// OAuth 2

const oauth = {
  // "dev oauth integration dp"
  client_id: "ba933fa1-14d1-4f38-af70-b45343a3192a",
}

const redirect_uri = "http://localhost:3000/dev.html";

function make_oauth_link({ add_nocsrf_f }) {
  let url = new URL("https://app.hubspot.com/oauth/authorize");
  const nocsrf = Math.random().toString(36).substring(2);
  add_nocsrf_f(nocsrf);
  const query_string_param = {
    response_type: "code",
    client_id: oauth.client_id,
    redirect_uri,
    scope: "contacts", // space separated
    state: nocsrf,
  };
  Object.keys(query_string_param).forEach(key => {
    url.searchParams.append(key, query_string_param[key]);
  });
  return url;
}

const OauthPanel = ({ oauth_nocsrf_a_state, oauth_code_state }) => {

  let oauth_nocsrf_a = oauth_nocsrf_a_state.get();
  if (!oauth_nocsrf_a instanceof Array) {
    oauth_nocsrf_a = [];
  }
  const add_nocsrf_f = (nocsrf) => {
    oauth_nocsrf_a.push(nocsrf);
    if (oauth_nocsrf_a.length > 10) {
      oauth_nocsrf_a.unshif();
    }
    oauth_nocsrf_a_state.set(oauth_nocsrf_a);
  };

  let children = [
    <a key="a"
      onClick={async () => {
        console.log("click!");
        window.top.location.href = make_oauth_link({ add_nocsrf_f });
      }}
    >Authenticate with OAuth</a>
  ];

  const search = new URL(window.top.location.href).searchParams;
  const code = search.get("code");
  const nocsrf = search.get("state");
  if (nocsrf || code) {
    if (oauth_nocsrf_a.indexOf(nocsrf) !== -1) {
      console.log("Receiving!")
      children.push(<div key="r">Receiving oauth code</div>);
      oauth_code_state.set(code);
    } else {
      console.log("Failing!", { nocsrf, oauth_nocsrf_a });
      children.push(<div key="f">Oauth failed</div>);
    }
  }

  return <Panel>{children}</Panel>;
}

export { make_oauth_link, OauthPanel };
