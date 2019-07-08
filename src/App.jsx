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
  corsAnywhereFetch,
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
function valueGetter(obj) {
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
  queryString: { hapikey: "c35b9d4e-0049-49fe-a8cf-22dc422e7512" },
  fetchF: corsAnywhereFetch({ fetchF: fetch }),
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
    editDeal: {},
    screen: [
      "defaultScreen",
      "editDealScreen",
      "oauthScreen",
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
    this.ticketContext = dpapp.context.get("ticket");

    this.fetchData();
  }

  setState(state, ...args) {
    console.debug("setState", state);
    super.setState(state, ...args);
  }

  async fetchData() {
    fetcher.accountDetail().then((detail) => {
      this.setState({ detail });
    });

    const person = await this.ticketContext.get("person");

    const primaryEmail = person.emails[0];

    const contactJson = await fetcher.contactByEmail(primaryEmail);

    this.setState({ contactJson });

    if (!this.state.screen.match(/default/)) { return; }

    [
      [fetcher.dealIdByContact, fetcher.deal,
        "dealIdA", "dealA"],
      [fetcher.engagementIdByContact, fetcher.engagement,
        "engagementIdA", "engagementA"],
    ].forEach(async (
      [fetchItsIdByContact, fetchIt,
        idArrayN, arrayN]
    ) => {
      const json = await fetchItsIdByContact(contactJson.vid);

      const previousArray = this.state[arrayN] || [];
      const empty = new Array(json.results.length).fill();
      this.setState({
        [idArrayN]: json.results,
        [arrayN]: empty.map((_, index) => previousArray[index] || null),
      });

      json.results.forEach((id, index) => {
        fetchIt(id).then((dealJson) => {
          const array = this.state[arrayN].slice();
          array[index] = dealJson;
          this.setState({ [arrayN]: array });
        });
      });
    });
  }

  renderParseState() {
    let getN;
    let getC;
    let enableCreateDeal;
    if (this.state.contactJson !== undefined) {
      const { contactJson } = this.state;
      getN = valueGetter(contactJson.properties);
      getC = valueGetter(contactJson["associated-company"].properties);
      enableCreateDeal = true;
    } else {
      getN = (a, b) => b;
      getC = (a, b) => b;
      enableCreateDeal = false;
    }

    const both = getN("firstname") && getN("lastname");
    const contactName =
      getN("firstname", "") +
      (both ? " " : "") +
      getN("lastname", "").toUpperCase();

    const company = getC("name", "");
    const dealFilteredA = access(this.state, "dealA", [])
      .filter((json) => json);

    const noteFilteredA = [];
    const activityFilteredA = [];
    let showEngagementCount = false;

    /* Sort existing engagment json into noteJson and activityJson */
    obtain(this.state, "engagementIdA", (engagementIdA) => {
      const engagementJsonA = engagementIdA
        .map((EngagmentId, index) => index)
        .filter((index) => this.state.engagementA[index] !== null)
        .map((index) => this.state.engagementA[index]);

      engagementJsonA.forEach((json) => {
        if (json.engagement.type === "NOTE") {
          noteFilteredA.push(json);
        } else {
          activityFilteredA.push(json);
        }
      });

      if (engagementJsonA.length === engagementIdA.length) {
        showEngagementCount = true;
      }
    }, () => { });

    const {
      detail: { currency },
    } = this.state;

    return {
      dealFilteredA,
      activityFilteredA,
      noteFilteredA,
      contactName,
      getN,
      company,
      getC,
      currency,
      showEngagementCount,
      enableCreateDeal,
    };
  }

  render() {
    const {
      dealFilteredA, activityFilteredA, noteFilteredA,
      contactName, getN,
      company, getC,
      currency,
      showEngagementCount,
      enableCreateDeal,
    } = this.renderParseState();

    const renderCreateNewDealLink = () => {
      return <CreateNewDealLink
        {...{ enableCreateDeal }}
        callbackF={() => {
          this.setState({
            screen: "editDealScreen",
            editDeal: { title: "Create New Deal" },
          });
        }}
      />;
    };

    const edit = (dealId) => () => {
      this.setState({
        screen: "editDealScreen",
        editDeal: {
          dealId,
          title: "Edit Deal",
        },
      });
    };

    const renderDealList = () => {
      return <DealList {...{
        edit,
        currency,
        renderHead: renderCreateNewDealLink,
        dealFilteredA,
        valueGetter,
      }}
      />;
    };

    const renderActivityList =
      () => <ActivityList {...{ activityFilteredA }} />;

    const renderNoteList =
      () => <NoteList {...{ noteFilteredA }} />;

    const oauthNocsrfAState = LocalStorageState({
      key: "deskproHubspotOauthNocsrfA",
      defaultValue: [],
      component: this,
    });
    const oauthCodeState = LocalStorageState({
      key: "deskproHubspotOauthCode",
      defaultValue: null,
      component: this,
    });
    const renderOauthScreen = () => (<OauthPanel
      {...{ oauthNocsrfAState, oauthCodeState }}
    />);

    const renderDefaultScreen = () => (
      <div>
        <XList
          iter={[{
            pannelProps: { title: contactName },
            children: <PersonDataList getter={getN} />,
          }, {
            pannelProps: { title: company },
            children: <CompanyDataList getter={getC} />,
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
              arr ? ` (${arr.length})` : ""))(this.state.dealIdA)}`
          }
          </TabMenu>
          <TabMenu name="activities">{
            `Activities${
            showEngagementCount ? ` (${activityFilteredA.length})` : ""}`
          }
          </TabMenu>
          <TabMenu name="notes">{
            `Notes${
            showEngagementCount ? ` (${noteFilteredA.length})` : ""}`
          }
          </TabMenu>
        </Tabs>
        <SwitchCase
          on={this.state.activeTab}
          renderO={{
            deals: renderDealList,
            activities: renderActivityList,
            notes: renderNoteList,
          }}
        />
        {renderOauthScreen()}
      </div>
    );

    const gotoDefaultScreen = () => new Promise((resolve) => {
      this.setState({ screen: "defaultScreen" }, resolve);
    });

    const renderEditDealScreen = () => {
      return <EditDealForm
        {...{
          contactName,
          currency,
          fetcher,
        }}
        title={this.state.editDeal.title}
        cancelF={gotoDefaultScreen}
        submitF={(form, { setSubmitting }) => {
          const propertyO = {};
          HubspotFetcher.createDeal.allPropertyA.forEach((dealName) => {
            const value = form[dealName];
            if (value) {
              propertyO[dealName] = { name: dealName, value };
            }
          });
          fetcher.updateDeal({
            dealId: this.state.editDeal.dealId,
            body: { properties: propertyO },
          }).catch((error) => {
            console.error("fetcher.updateDeal", error);
          }).then(async () => {
            setSubmitting(false);
            await gotoDefaultScreen();
            await this.fetchData();
          });
        }}
      />;
    };

    return (<SwitchCase
      on={this.state.screen}
      renderO={{
        defaultScreen: renderDefaultScreen,
        editDealScreen: renderEditDealScreen,
        oauthScreen: renderOauthScreen,
      }}
    />);
  }
}

export default App;

