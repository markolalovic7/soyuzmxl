import dayjs from "dayjs";
import { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router";

import { useReactGA } from "../../hooks/google-analytics-hooks";
import { getAuthLanguage } from "../../redux/reselect/auth-selector";
import { getSportsTree } from "../../redux/slices/sportsTreeSlice";
import ScrollToTop from "../common/components/ScrollToTop/ScrollToTop";

import SettingsPage from "./components/SettingsPage";
import Layout from "./hoc/Layout";
import classes from "./scss/citymobile.module.scss";
import "applications/citydesktop/scss/sportradar-custombet-theme.scss";

const AZSportsPage = lazy(() => import("./components/AZSportsPage"));
const CouponPage = lazy(() => import("./components/CouponPage"));
const LiveEventDetail = lazy(() => import("./components/EventDetail/LiveEventDetail"));
const PrematchEventDetail = lazy(() => import("./components/EventDetail/PrematchEventDetail"));
const HomePage = lazy(() => import("./components/HomePage"));
const LeaguePage = lazy(() => import("./components/LeaguePage"));
const LiveBetting = lazy(() => import("./components/LiveBetting"));
const ResultPage = lazy(() => import("./components/ResultPage"));
const SearchPage = lazy(() => import("./components/SearchPage"));

const SportPage = lazy(() => import("./components/SportPage"));
const TodayPage = lazy(() => import("./components/TodayPage"));

const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

const SIX_HOUR_CACHE_KEY = "6_HOUR";

const CityMobileApp = () => {
  const language = useSelector(getAuthLanguage);

  const dispatch = useDispatch();

  useReactGA(process.env.REACT_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID);

  useEffect(() => {
    // Initialise as we start the app, so it can be used in various places like the navigation menu
    dispatch(getSportsTree({ standard: true }));
    const endDate = `${dayjs()
      .add(6, "hour")
      .set("minute", 59)
      .set("second", 59)
      .set("millisecond", 999)
      .toDate()
      .toISOString()
      .slice(0, -1)}+00:00`;
    dispatch(getSportsTree({ cacheKey: SIX_HOUR_CACHE_KEY, standard: true, toDate: endDate }));

    const interval = setInterval(() => {
      // Refresh periodically
      dispatch(getSportsTree({ standard: true }));
      dispatch(getSportsTree({ cacheKey: SIX_HOUR_CACHE_KEY, standard: true, toDate: endDate }));
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, language]);

  // BetRadar LMT
  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `(function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,
g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h)
)})(window,document,"script", "https://widgets.sir.sportradar.com/f8a5dae1c4b1ad68f3cad25bbf2c8083/widgetloader", "SIR", {
    theme: false, // using custom theme
    language: "${language}"
});`;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    // Setup Routing here
    <div className={classes["citymobile-body"]}>
      <ScrollToTop />
      <Layout>
        <Switch>
          <Route exact path="/sports/:sportCode">
            <SportPage />
          </Route>
          <Route exact path="/leagues/:sportCode/:eventPathId">
            <LeaguePage />
          </Route>
          <Route exact path="/coupons/:sportCode/:eventPathIds">
            <div>
              <CouponPage />
            </div>
          </Route>
          <Route exact path="/today">
            <TodayPage />
          </Route>
          <Route exact path="/az">
            <AZSportsPage />
          </Route>
          <Route exact path="/events/prematch/:eventId">
            <PrematchEventDetail />
          </Route>
          <Route exact path="/events/live/:eventId">
            <LiveEventDetail />
          </Route>
          <Route exact path="/search">
            <SearchPage />
          </Route>
          <Route exact path="/live">
            <LiveBetting />
          </Route>
          <Route exact path="/live/:sportCode">
            <LiveBetting />
          </Route>
          <Route exact path="/results">
            <ResultPage />
          </Route>
          <Route exact path="/settings">
            <SettingsPage />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
        </Switch>
      </Layout>
      {/*  placeholder for the custombet pop up - note, remove if we end up with the custombet inline implementation */}
      <div className="custombet" id="custombet" />
    </div>
  );
};

export default CityMobileApp;
