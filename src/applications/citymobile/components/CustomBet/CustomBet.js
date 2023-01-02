import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";

import { isNotEmpty } from "../../../../utils/lodash";
import {
  betslipCallback,
  calculate,
  getAvailableMarkets,
  getFixture,
  getMarkets,
  getProfile,
} from "../../../../utils/sportradar-custom-bet/sportradar-custom-bet";

import classes from "applications/citymobile/scss/citymobile.module.scss";
import Spinner from "applications/common/components/Spinner";

const getMatchId = (feedcode) => {
  if (feedcode) {
    return feedcode.substring(feedcode.lastIndexOf(":") + 1, feedcode.length);
  }

  return undefined;
};

const propTypes = {
  feedcode: PropTypes.string.isRequired,
  live: PropTypes.bool.isRequired,
  sportCode: PropTypes.string.isRequired,
};

function getSportCodeBRId(sportCode) {
  switch (sportCode) {
    case "FOOT":
      return "1";
    case "BASK":
      return "2";
    case "AMFB":
      return "16";
    default:
      return undefined;
  }
}

const CustomBet = ({ feedcode, live, sportCode }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isCustomBetWidgetLoaded, setIsCustomBetWidgetLoaded] = useState(false);

  useEffect(() => {
    if (feedcode && window.SIR) {
      // we use sr-widget-2 to differentiate from Match Trackers, where we use sr-widget-1
      window.SIR("addWidget", ".sr-widget-100", "customBet", {
        buttonTitle: "Custom Bet",
        dataProvider: "uofProxy",
        dataProviderConfig: {
          addToBetSlip: betslipCallback(dispatch, location.pathname, live, true),
          calculate,
          getAvailableMarkets,
          getFixture,
          getMarkets,
          getProfile,
        },
        isDialogInFullScreen: false,
        isInline: true, // change this if intending to use it as a pop up
        matchId: getMatchId(feedcode),
        overlayParent: "#custombet",
        sportId: getSportCodeBRId(sportCode),
        useClientTheming: false,
        useSessionStorage: true,
      });

      return () => {
        window.SIR("removeWidget", ".sr-widget-100");
      };
    }

    return undefined;
  }, [feedcode]);

  // the widget takes forever to load. Track when it loads, and show a spinning wheel in the meantime
  useEffect(() => {
    const interval = setInterval(
      () => {
        const elements = Array.from(document.getElementsByClassName("srm-fullyloaded"));
        setIsCustomBetWidgetLoaded(isNotEmpty(elements));
      },
      isCustomBetWidgetLoaded ? 5000 : 100, // check frequently while we wait for the widget to load, and easy up later on
    );

    return () => clearInterval(interval);
  }, [isCustomBetWidgetLoaded]);

  return (
    <div className="custombet widgets">
      {!isCustomBetWidgetLoaded && (
        <div className={classes["homepage-spinner"]} style={{ top: live ? "600px" : "500px" }}>
          <Spinner className={classes.loader} />
        </div>
      )}
      <div className="sr-widget sr-widget-100" id="sr-widget" />
    </div>
  );
};

CustomBet.propTypes = propTypes;

export default React.memo(CustomBet);
