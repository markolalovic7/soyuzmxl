import dayjs from "dayjs";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router";

import { useReactGA } from "../../hooks/google-analytics-hooks";
import { getAuthIsIframe, getAuthLanguage } from "../../redux/reselect/auth-selector";
import ScrollToTop from "../common/components/ScrollToTop/ScrollToTop";

import Countrypage from "./components/Countrypage/Countrypage";
import Couponpage from "./components/Couponpage/Couponpage";
import LiveEventDetailPage from "./components/EventDetailPage/Live/LiveEventDetailPage";
import PrematchEventDetailPage from "./components/EventDetailPage/Prematch/PrematchEventDetailPage";
import Homepage from "./components/Homepage/Homepage";
import Leaguepage from "./components/Leaguepage/Leaguepage";
import LiveOverview from "./components/LiveOverview/LiveOverview";
import LiveSchedule from "./components/LiveSchedule/LiveSchedule";
import ResultPage from "./components/ResultPage/ResultPage";
import Sportpage from "./components/Sportpage/Sportpage";
import TodaysEvents from "./components/TodaysEvents/TodaysEvents";
import Layout from "./hoc/Layout/Layout";
import LiveThreeColumnLayout from "./hoc/Layout/ThreeColumnLayout/LiveThreeColumnLayout";
import ThreeColumnLayout from "./hoc/Layout/ThreeColumnLayout/ThreeColumnLayout";
import TwoColumnLayout from "./hoc/Layout/ThreeColumnLayout/TwoColumnLayout";
import classes from "./scss/citywebstyle.module.scss";
import "applications/citydesktop/scss/sportradar-custombet-theme.scss";

const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

const CityDesktopApp = () => {
  const isInIframe = useSelector(getAuthIsIframe);
  const language = useSelector(getAuthLanguage);

  useReactGA(process.env.REACT_APP_GOOGLE_ANALYTICS_MEASUREMENT_ID);

  // https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html
  useEffect(() => {
    const key = `f8a5dae1c4b1ad68f3cad25bbf2c8083`;

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

  useEffect(() => {
    // force avoidance of funny scrollbars appearing
    if (isInIframe) {
      document.body.style.overflow = "hidden";
    }
  }, [isInIframe]);

  return (
    // Setup Routing here
    <div className={classes["citydesktop-body"]}>
      <ScrollToTop />

      <Layout>
        <Switch>
          <Route exact path="/today">
            <ThreeColumnLayout>
              <TodaysEvents />
            </ThreeColumnLayout>
          </Route>
          <Route exact path="/leagues/:sportCode/:eventPathId">
            <ThreeColumnLayout>
              <Leaguepage />
            </ThreeColumnLayout>
          </Route>
          <Route exact path="/coupons/:sportCode/:eventPathIds">
            <ThreeColumnLayout>
              <Couponpage />
            </ThreeColumnLayout>
          </Route>
          <Route exact path="/countries/:sportCode/:eventPathId">
            <ThreeColumnLayout>
              <Countrypage />
            </ThreeColumnLayout>
          </Route>
          <Route exact path="/sports/:sportCode">
            <ThreeColumnLayout>
              <Sportpage />
            </ThreeColumnLayout>
          </Route>
          <Route exact path="/events/prematch/:eventId">
            <ThreeColumnLayout>
              <PrematchEventDetailPage />
            </ThreeColumnLayout>
          </Route>
          <Route exact path="/results">
            <ThreeColumnLayout>
              <ResultPage />
            </ThreeColumnLayout>
          </Route>
          <Route exact path="/events/live/:eventId">
            <LiveThreeColumnLayout>
              <LiveEventDetailPage />
            </LiveThreeColumnLayout>
          </Route>
          <Route exact path="/events/live">
            <LiveThreeColumnLayout>
              <LiveEventDetailPage />
            </LiveThreeColumnLayout>
          </Route>
          <Route exact path="/live">
            <TwoColumnLayout>
              <LiveOverview />
            </TwoColumnLayout>
          </Route>
          <Route exact path="/live-schedule">
            <LiveThreeColumnLayout>
              <LiveSchedule />
            </LiveThreeColumnLayout>
          </Route>
          <Route exact path="/">
            <ThreeColumnLayout>
              <Homepage />
            </ThreeColumnLayout>
          </Route>
        </Switch>
      </Layout>
      {/*  placeholder for the custombet pop up - note, remove if we end up with the custombet inline implementation */}
      <div className="custombet" id="custombet" />
    </div>
  );
};

export default CityDesktopApp;
