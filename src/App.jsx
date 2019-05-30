import React from "react";
import PropTypes from "prop-types";
import {
  Tabs,
  TabMenu,
} from "@deskpro/apps-components";

import "./styles.css";

import {
  HubspotFetcher,
} from "./HubspotFetcher";

import {
  OauthPanel,
} from "./oauth";

import {
  access,
  obtain,
  LocalStorageState,
  cors_anywhere_fetch,
} from "./util";

import {
  SwitchCase,
  XList,
} from "./component";

import {
  EditDealForm,
  PersonDataList,
  CompanyDataList,
  DealList,
  NoteList,
  ActivityList,
  CreateNewDealLink,
} from "./UI";


/**
 * return a function which gets the `.value` property of the specified property,
 * and handles missing property cases.
 */
function value_getter(obj) {
  return function get(key, alternative = "") {
    if (obj[key]) {
      if (obj[key].value !== undefined) {
        return obj[key].value;
      }
      console.warn(`property ${key} exists but not ${key}.value - ` +
        `defaulting to "${alternative}"`);
    }
    return alternative;
  };
}

const fetcher = new HubspotFetcher({
  query_string: { hapikey: "c35b9d4e-0049-49fe-a8cf-22dc422e7512" },
  fetch_f: cors_anywhere_fetch({ fetch_f: fetch }),
});

class App extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    dpapp: PropTypes.object.isRequired,
    uiProps: PropTypes.shape({
      state: PropTypes.oneOf(["ready", "loading", "error", "inactive"]),
      display: PropTypes.oneOf(["collapsed", "expanded", "fullscreen"]),
      badgeCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      badgeVisibility: PropTypes.oneOf(["hidden", "visible"]),
    }).isRequired,
  };

  state = {
    activeTab: "deals",
    detail: {
      currency: "¤",
    },
    edit_deal: {},
    screen: [
      "default_screen",
      "edit_deal_screen",
      "oauth_screen",
    ][0],
  }

  componentDidMount() {
    const me = this;
    // eslint-disable-next-line
    console.debug(function app (o = {}) { return o.app = me; });

    const { body } = window.top.document;
    body.style.margin = "0";
    const { style = {} } = body.querySelector("iframe");
    style.margin = "0";

    const { dpapp } = this.props;
    this.ticket_context = dpapp.context.get("ticket");

    this.fetch_data();
  }

  setState(state, ...args) {
    console.debug("setState", state);
    super.setState(state, ...args);
  }

  async fetch_data() {
    fetcher.account_detail().then((detail) => {
      this.setState({ detail });
    });

    const person = await this.ticket_context.get("person");

    const primary_email = person.emails[0];

    const contact_json = await fetcher.contact_by_email(primary_email);

    this.setState({ contact_json });

    if (!this.state.screen.match(/default/)) { return; }

    [
      [fetcher.dealId_by_contact, fetcher.deal,
        "dealId_a", "deal_a"],
      [fetcher.engagementId_by_contact, fetcher.engagement,
        "engagementId_a", "engagement_a"],
    ].forEach(async (
      [fetch_its_id_by_contact, fetch_it,
        id_array_n, array_n]
    ) => {
      const json = await fetch_its_id_by_contact(contact_json.vid);

      const previous_array = this.state[array_n] || [];
      const empty = new Array(json.results.length).fill();
      this.setState({
        [id_array_n]: json.results,
        [array_n]: empty.map((_, index) => previous_array[index] || null),
      });

      json.results.forEach((id, index) => {
        fetch_it(id).then((deal_json) => {
          const array = this.state[array_n].slice();
          array[index] = deal_json;
          this.setState({ [array_n]: array });
        });
      });
    });
  }

  render_parse_state() {
    let get_n;
    let get_c;
    let enable_create_deal;
    if (this.state.contact_json !== undefined) {
      const { contact_json } = this.state;
      get_n = value_getter(contact_json.properties);
      get_c = value_getter(contact_json["associated-company"].properties);
      enable_create_deal = true;
    } else {
      get_n = (a, b) => b;
      get_c = (a, b) => b;
      enable_create_deal = false;
    }

    const both = get_n("firstname") && get_n("lastname");
    const contact_name =
      get_n("firstname", "") +
      (both ? " " : "") +
      get_n("lastname", "").toUpperCase();

    const company = get_c("name", "");
    const deal_filtered_a = access(this.state, "deal_a", [])
      .filter((json) => json);

    const note_filtered_a = [];
    const activity_filtered_a = [];
    let show_engagement_count = false;

    /* Sort existing engagment json into note_json and activity_json */
    obtain(this.state, "engagementId_a", (engagementId_a) => {
      const engagement_json_a = engagementId_a
        .map((_engagmentId, index) => index)
        .filter((index) => this.state.engagement_a[index] !== null)
        .map((index) => this.state.engagement_a[index]);

      engagement_json_a.forEach((json) => {
        if (json.engagement.type === "NOTE") {
          note_filtered_a.push(json);
        } else {
          activity_filtered_a.push(json);
        }
      });

      if (engagement_json_a.length === engagementId_a.length) {
        show_engagement_count = true;
      }
    }, () => { });

    const {
      detail: { currency },
    } = this.state;

    return {
      deal_filtered_a,
      activity_filtered_a,
      note_filtered_a,
      contact_name,
      get_n,
      company,
      get_c,
      currency,
      show_engagement_count,
      enable_create_deal,
    };
  }

  render() {
    const {
      deal_filtered_a, activity_filtered_a, note_filtered_a,
      contact_name, get_n,
      company, get_c,
      currency,
      show_engagement_count,
      enable_create_deal,
    } = this.render_parse_state();

    const renderCreateNewDealLink = () => {
      return <CreateNewDealLink
        {...{ enable_create_deal }}
        callback_f={() => {
          this.setState({
            screen: "edit_deal_screen",
            edit_deal: { title: "Create New Deal" },
          });
        }}
      />;
    };

    const edit = (dealId) => () => {
      this.setState({
        screen: "edit_deal_screen",
        edit_deal: {
          dealId,
          title: "Edit Deal",
        },
      });
    };

    const renderDealList = () => {
      return <DealList {...{
        edit,
        currency,
        render_head: renderCreateNewDealLink,
        deal_filtered_a,
        value_getter,
      }}
      />;
    };

    const renderActivityList =
      () => <ActivityList {...{ activity_filtered_a }} />;

    const renderNoteList =
      () => <NoteList {...{ note_filtered_a }} />;

    const oauth_nocsrf_a_state = LocalStorageState({
      key: "deskpro_hubspot_oauth_nocsrf_a",
      default_value: [],
      component: this,
    });
    const oauth_code_state = LocalStorageState({
      key: "deskpro_hubspot_oauth_code",
      default_value: null,
      component: this,
    });
    const renderOauthScreen = () => (<OauthPanel
      {...{ oauth_nocsrf_a_state, oauth_code_state }}
    />);

    const renderDefaultScreen = () => (
      <div>
        <XList
          iter={[{
            pannelProps: { title: contact_name },
            children: <PersonDataList getter={get_n} />,
          }, {
            pannelProps: { title: company },
            children: <CompanyDataList getter={get_c} />,
          }]}
          callback={((props, i) => { return { ...props, key: i }; })}
          Outer="div"
        />
        <Tabs
          active={this.state.activeTab}
          onChange={(clickedTab) => {
            this.setState({ activeTab: clickedTab });
          }}
        >
          <TabMenu name="deals">{
            `Deals${((arr) => (
              arr ? ` (${arr.length})` : ""))(this.state.dealId_a)}`
          }
          </TabMenu>
          <TabMenu name="activities">{
            `Activities${
            show_engagement_count ? ` (${activity_filtered_a.length})` : ""}`
          }
          </TabMenu>
          <TabMenu name="notes">{
            `Notes${
            show_engagement_count ? ` (${note_filtered_a.length})` : ""}`
          }
          </TabMenu>
        </Tabs>
        <SwitchCase
          on={this.state.activeTab}
          render_o={{
            deals: renderDealList,
            activities: renderActivityList,
            notes: renderNoteList,
          }}
        />
        {renderOauthScreen()}
      </div>
    );

    const goto_default_screen = () => new Promise((resolve) => {
      this.setState({ screen: "default_screen" }, resolve);
    });

    const renderEditDealScreen = () => {
      return <EditDealForm
        {...{
          contact_name,
          currency,
          fetcher,
        }}
        title={this.state.edit_deal.title}
        cancel_f={goto_default_screen}
        submit_f={(form, { setSubmitting }) => {
          const property_o = {};
          HubspotFetcher.create_deal.all_property_a.forEach((deal_name) => {
            const value = form[deal_name];
            if (value) {
              property_o[deal_name] = { name: deal_name, value };
            }
          });
          fetcher.update_deal({
            dealId: this.state.edit_deal.dealId,
            body: { properties: property_o },
          }).catch((error) => {
            console.error("fetcher.update_deal", error);
          }).then(async () => {
            setSubmitting(false);
            await goto_default_screen();
            await this.fetch_data();
          });
        }}
      />;
    };

    return (<SwitchCase
      on={this.state.screen}
      render_o={{
        default_screen: renderDefaultScreen,
        edit_deal_screen: renderEditDealScreen,
        oauth_screen: renderOauthScreen,
      }}
    />);
  }
}

export default App;

