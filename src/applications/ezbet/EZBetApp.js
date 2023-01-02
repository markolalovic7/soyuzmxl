import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { isIOS } from "react-device-detect";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { Breakpoint, setDefaultBreakpoints } from "react-socks";

import { getAuthLanguage, getAuthLoggedIn } from "../../redux/reselect/auth-selector";
import { getActiveBetCount } from "../../redux/slices/cashoutSlice";
import { getSettings } from "../../redux/slices/ezSettingsSlice";
import { getPeriodsBySport } from "../../redux/slices/periodSlice";
import { getSportsTree } from "../../redux/slices/sportsTreeSlice";
import { isNotEmpty } from "../../utils/lodash";
import {
  getPatternLive,
  getPatternLiveSportDetail,
  getPatternLiveSportsEventPath,
  getPatternLiveSportsEventPathEvent,
  getPatternPrematchSports,
  getPatternPrematchSportsEventPath,
  getPatternPrematchSportsEventPathEvent,
  getPatternSearch,
  getPatternSearchResults,
} from "../../utils/route-patterns";
import ScrollToTop from "../common/components/ScrollToTop/ScrollToTop";

import EZSportCarouselWrapper from "./hoc/EZSportCarouselWrapper";
import Layout from "./hoc/Layout";
import { useOutcomeInitialPrices } from "./hooks/ez-betslip-outcome-initial-prices-hooks";
import DesktopEventDetailPage from "./pages/DesktopEventDetailPage";
import DesktopLiveEventDetailPage from "./pages/DesktopLiveEventDetailPage/components";
import EventDetailPage from "./pages/EventDetailPage";
import HomePage from "./pages/HomePage";
import LeaguePage from "./pages/LeaguePage";
import LiveEventDetailPage from "./pages/LiveEventDetailPage/components";
import LiveHomePage from "./pages/LiveHomePage/components";
import LiveLeaguePage from "./pages/LiveLeaguePage";
import SearchPage from "./pages/SearchPage/components/SearchPage";
import classes from "./scss/ezbet.module.scss";
import { ALL_KEY, TWO_DAY_SPORTS_KEY } from "./utils/constants";
import { getSportEndDate } from "./utils/sports-tree-utils";

// const HomePage = lazy(() => import("./pages/HomePage"));
// const LeaguePage = lazy(() => import("./pages/LeaguePage/components"));

const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

const XSMALL = "xsmall";
const TABLET = "tablet";
const MEDIUM = "medium";
const LARGE = "large";
const XLARGE = "xlarge";
const SUPERLARGE = "superlarge";

setDefaultBreakpoints([
  { [XSMALL]: 0 }, // all mobile devices
  { [TABLET]: 674 }, // tablet devices
  { [MEDIUM]: 842 }, // small desktop?? large tablet?
  { [LARGE]: 1024 }, // smaller laptops
  { [XLARGE]: 1080 }, // laptops and desktops
  { [SUPERLARGE]: 1920 }, // super large laptops and desktops
]);

const EZBetApp = () => {
  const accountId = useSelector((state) => state.auth.accountId);
  const isLoggedIn = useSelector(getAuthLoggedIn);
  const language = useSelector(getAuthLanguage);

  // Load the sports tree data as soon as the app does, else it blocks other navigation sections
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const pathname = location.pathname;

  const [currentTab, setCurrentTab] = useState("PREMATCH"); // PREMATCH VS LIVE

  useOutcomeInitialPrices(dispatch);

  useEffect(() => {
    // Initialise as we start the app, so it can be used in various places like the navigation menu
    const endDate = getSportEndDate();
    dispatch(getSportsTree({ cacheKey: TWO_DAY_SPORTS_KEY, standard: true, toDate: endDate }));

    const interval = setInterval(() => {
      // Refresh periodically
      dispatch(getSportsTree({ cacheKey: TWO_DAY_SPORTS_KEY, standard: true, toDate: endDate }));
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, language]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getSettings());
    }
  }, [dispatch]);

  // Periodically refresh the active bet count (used in various points)
  useEffect(() => {
    if (isLoggedIn && accountId) {
      const interval = setInterval(() => {
        // Refresh periodically
        dispatch(getActiveBetCount());
      }, 3000);

      return () => clearInterval(interval);
    }

    return undefined;
  }, [isLoggedIn, accountId]);

  useEffect(() => {
    dispatch(getPeriodsBySport());
  }, [dispatch]);

  // Notify parent frame when we swap between prematch and live.
  useEffect(() => {
    if (pathname.startsWith("/live/") && currentTab !== "LIVE") {
      // duplicate messages for backwards compatibility
      window.parent.postMessage(
        {
          action: "app.ez.location",
          location: "LIVE",
        },
        "*",
      );
      window.parent.postMessage(
        {
          action: "app.location",
          location: "LIVE",
        },
        "*",
      );

      setCurrentTab("LIVE");
    } else if (!pathname.startsWith("/live/") && currentTab === "LIVE") {
      // duplicate messages for backwards compatibility
      window.parent.postMessage(
        {
          action: "app.ez.location",
          location: "PREMATCH",
        },
        "*",
      );
      window.parent.postMessage(
        {
          action: "app.location",
          location: "PREMATCH",
        },
        "*",
      );

      setCurrentTab("PREMATCH");
    }
  }, [currentTab, pathname]);

  // Listener for parent redirection requests.
  useEffect(() => {
    // Add a listener for parent frames requests to go to various internal paths
    window.addEventListener(
      "message",
      (event) => {
        const data = event.data || {};

        if (data.action === "app.ez.navigation") {
          console.log("-----------------------------");
          console.log(`Parent frame requested navigation to: ${data.goTo}`);
          console.log(data);
          console.log("-----------------------------");

          if (data.goTo === "HOME") {
            history.push("/");
          } else if (data.goTo === "LIVE") {
            history.push("/live");
          }
        }
      },
      false,
    );
  }, []); // never re-add

  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    const key = `9287bf5fa54527919f0c98f5312f3f7b`;

    const script = document.createElement("script");
    script.innerHTML = `(function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,
g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h)
)})(window,document,"script", "https://widgets.sir.sportradar.com/${key}/widgetloader", "SIR", {
    theme: false, // using custom theme
    language: "${language}"
});`;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      window.SIR = null; // for good measure
    };
  }, [language]);

  // docs.betradar.com/display/BD/AudioVisual+Video+Player
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://avplayer-cdn.sportradar.com/dist/latest/avvpl-player.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      window.avvpl = null; // for good measure
    };
  }, [language]);

  // effect to prevent back history gestures on mobile, which mess with our own gestures for swiping
  useEffect(() => {
    document.getElementById("ezbet-body").addEventListener("touchstart", (e) => {
      // prevent swipe to navigate gesture

      if (isNotEmpty(e?.touches)) {
        const x = e.touches[0]?.clientX;

        // is not near edge of view, exit
        if (x > 10 && x < window.innerWidth - 10) return;

        e.preventDefault();
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <meta
          content={
            isIOS ? "width=device-width, initial-scale=1, maximum-scale=1" : "width=device-width, initial-scale=1"
          }
          name="viewport"
        />
      </Helmet>
      <div className={classes["ezbet-body"]} id="ezbet-body">
        <ScrollToTop />
        <Layout>
          <Switch>
            {/* League Level */}
            <Route exact path={getPatternPrematchSportsEventPath()}>
              <EZSportCarouselWrapper>
                <LeaguePage />
              </EZSportCarouselWrapper>
            </Route>

            {/* Event Detail Level */}
            <Route exact path={getPatternPrematchSportsEventPathEvent()}>
              <EZSportCarouselWrapper>
                <Breakpoint down tablet>
                  <EventDetailPage />
                </Breakpoint>
                <Breakpoint medium up>
                  <DesktopEventDetailPage />
                </Breakpoint>
              </EZSportCarouselWrapper>
            </Route>

            {/* Search */}
            <Route exact path={getPatternSearch()}>
              <EZSportCarouselWrapper>
                <SearchPage />
              </EZSportCarouselWrapper>
            </Route>
            <Route exact path={getPatternSearchResults()}>
              <EZSportCarouselWrapper>
                <SearchPage />
              </EZSportCarouselWrapper>
            </Route>

            {/* Home */}
            <Route exact path={getPatternPrematchSports()}>
              <EZSportCarouselWrapper>
                <HomePage />
              </EZSportCarouselWrapper>
            </Route>

            {/* Live - landing page */}
            <Route exact path={getPatternLive()}>
              <EZSportCarouselWrapper live>
                <div />
              </EZSportCarouselWrapper>
            </Route>

            {/* Live - landing page with sport selected! */}
            <Route exact path={getPatternLiveSportDetail()}>
              <EZSportCarouselWrapper live>
                <LiveHomePage />
              </EZSportCarouselWrapper>
            </Route>

            {/* Live - sport and league selected! */}
            <Route exact path={getPatternLiveSportsEventPath()}>
              <EZSportCarouselWrapper live>
                <LiveLeaguePage />
              </EZSportCarouselWrapper>
            </Route>

            {/* Live - eventDetail */}
            <Route exact path={getPatternLiveSportsEventPathEvent()}>
              <EZSportCarouselWrapper live>
                <Breakpoint down tablet>
                  <LiveEventDetailPage />
                </Breakpoint>
                <Breakpoint medium up>
                  <DesktopLiveEventDetailPage />
                </Breakpoint>
              </EZSportCarouselWrapper>
            </Route>

            {/* If we are here, send the user to the home page */}
            <Redirect to={`/prematch/sport/${ALL_KEY}`} />
          </Switch>
        </Layout>
      </div>
    </>
  );
};

export default EZBetApp;
