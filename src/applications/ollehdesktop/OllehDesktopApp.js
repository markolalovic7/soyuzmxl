import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router";

import withFavicon from "../../hocs/withFavicon";
import withTitleBrandName from "../../hocs/withTitleBrandName";
import { useSportsTree } from "../../hooks/sports-tree-hooks";
import {
  getPatternBetradarVirtual,
  getPatternBetradarVirtualSport,
  getPatternContentPage,
  getPatternLive,
  getPatternLiveCalendar,
  getPatternLiveEventDetail,
  getPatternPrematch,
  getPatternPrematchEventDetail,
  getPatternPrematchMain,
} from "../../utils/route-patterns";

import Layout from "./components/Layout";
import CalendarPage from "./pages/CalendarPage";
import ContentPage from "./pages/ContentPage";
import LivePage from "./pages/LivePage";
import SportsPage from "./pages/SportsPage";
import VirtualSportsPage from "./pages/VirtualSportsPage";

const OllehDesktopApp = () => {
  // Load the sports tree data as soon as the app does, else it blocks other navigation sections
  const dispatch = useDispatch();
  useSportsTree({ standard: true }, dispatch);

  return (
    <Layout>
      <Switch>
        <Redirect exact from="/" to={getPatternLive()} />
        <Route exact path={getPatternLiveCalendar()}>
          <CalendarPage />
        </Route>
        <Route exact path={getPatternBetradarVirtual()}>
          <VirtualSportsPage />
        </Route>
        <Route exact path={getPatternBetradarVirtualSport()}>
          <VirtualSportsPage />
        </Route>
        <Route exact path={getPatternLive()}>
          <LivePage />
        </Route>
        <Route exact path={getPatternLiveEventDetail()}>
          <LivePage />
        </Route>
        <Route exact path={getPatternContentPage()}>
          <ContentPage />
        </Route>
        <Route exact path={getPatternPrematch()}>
          <SportsPage />
        </Route>
        <Route exact path={getPatternPrematchMain()}>
          <SportsPage />
        </Route>
        <Route exact path={getPatternPrematchEventDetail()}>
          <SportsPage />
        </Route>

        {/* Fallback */}
        <Redirect to="/live" />
      </Switch>
    </Layout>
  );
};

export default withFavicon(withTitleBrandName(OllehDesktopApp));
