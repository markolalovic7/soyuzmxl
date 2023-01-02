import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useLocation } from "react-router";

import { getAuthLanguage } from "../../../../../redux/reselect/auth-selector";
import { getCmsLayoutCompactDesktopRightColumnFirstMatchTracker } from "../../../../../redux/reselect/cms-layout-widgets";
import {
  getPatternLive,
  getPatternLiveEvent,
  getPatternLiveEventDetail,
  getPatternLiveMultiview,
} from "../../../../../utils/route-patterns";
import { useLiveData } from "../../../../common/hooks/useLiveData";
import CompactLiveEventPage from "../../CompactLiveEventPage";
import LiveMultiview from "../../LiveMultiview/components";

const CompactLive = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const language = useSelector(getAuthLanguage);

  const matchTrackerWidget = useSelector((state) =>
    getCmsLayoutCompactDesktopRightColumnFirstMatchTracker(state, location),
  );

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  // Reference:  https://widgets.sir.sportradar.com/docs/Widgets.match.LMT.html.
  useEffect(() => {
    if (matchTrackerWidget?.data?.mode === "BETRADAR") {
      const clientId = matchTrackerWidget.data.betradarClientId;
      const script = document.createElement("script");
      script.innerHTML = `(function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h))})(window,document,"script", "https://widgets.sir.sportradar.com/${clientId}/widgetloader", "SIR", {
                              theme: false, // using custom theme
                              language: "${language}"
                          });`;
      // script.type = "application/javascript";
      // script.async = true;

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        window.SIR = null; // for good measure
      };
    }

    return undefined;
  }, [matchTrackerWidget, language]);

  return (
    <Switch>
      <Route exact path={getPatternLive()}>
        <CompactLiveEventPage />
      </Route>
      <Route exact path={getPatternLiveEventDetail()}>
        <CompactLiveEventPage />
      </Route>
      <Route exact path={getPatternLiveEvent()}>
        <CompactLiveEventPage />
      </Route>
      <Route exact path={getPatternLiveMultiview()}>
        <LiveMultiview />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
export default CompactLive;
