import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getCitySportIcon } from "../../../../../../utils/city/sporticon-utils";
import { gaEvent } from "../../../../../../utils/google-analytics-utils";
import { getHighlightEventPathIds } from "../../../../../../utils/highlight-utils";
import classes from "../../../../scss/citywebstyle.module.scss";

const SIX_HOUR_CACHE_KEY = "6_HOUR";

const SportsCarouselSlider = ({ activeCarouselSport, combinedSports, setActiveCarouselSport, sports }) => {
  const scrl = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(false);

  useEffect(() => {
    if (scrl.current) {
      setScrollEnd(Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <= scrl.current.offsetWidth);
    }
  }, [scrl.current, combinedSports]);

  // Slide click
  const slide = (shift) => {
    scrl.current.scrollLeft += shift;
    setScrollX(scrollX + shift);

    if (Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <= scrl.current.offsetWidth) {
      setScrollEnd(true);
    } else {
      setScrollEnd(false);
    }
  };

  const scrollCheck = () => {
    setScrollX(scrl.current.scrollLeft);
    if (Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <= scrl.current.offsetWidth) {
      setScrollEnd(true);
    } else {
      setScrollEnd(false);
    }
  };

  return (
    <div className={classes["sports-slider"]} style={{ position: "relative" }}>
      <div className={classes["sports-slider__slider"]} ref={scrl} onChange={scrollCheck} onScroll={scrollCheck}>
        {combinedSports.map((sport) => {
          const sportsKey = `sports-${sport.code}`;

          const image = getCitySportIcon(sport.code);
          if (!sport.eventCount || sport.eventCount === 0) {
            return null;
          }

          return (
            <div
              className={`${classes["sports-slider__item"]} ${
                activeCarouselSport?.code === sport.code ? classes["active"] : ""
              }`}
              key={sportsKey}
              style={{ cursor: "pointer" }}
              onClick={() => setActiveCarouselSport(sport)}
            >
              <span className={classes["sports-slider__icon"]}>
                <img alt={sport.desc} src={image} />
              </span>
              <span className={classes["sports-slider__text"]}>{sports ? sports[sport.code].description : ""}</span>
              <span className={classes["sports-slider__text"]}>{sport.eventCount}</span>
            </div>
          );
        })}
      </div>
      {scrollX !== 0 && (
        <button
          className={cx(classes["sports-slider__slider__navbutton"], classes["left"])}
          type="button"
          onClick={() => slide(-1 * 98)}
        >
          <svg
            style={{
              fill: "currentColor",
              height: "60%",
              left: "20%",
              position: "absolute",
              top: "20%",
              width: "60%",
            }}
            viewBox="0 0 100 100"
          >
            <path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" />
          </svg>
        </button>
      )}
      {!scrollEnd && (
        <button
          className={cx(classes["sports-slider__slider__navbutton"], classes["right"])}
          type="button"
          onClick={() => slide(+1 * 98)}
        >
          <svg
            style={{
              fill: "currentColor",
              height: "60%",
              left: "20%",
              position: "absolute",
              top: "20%",
              width: "60%",
            }}
            viewBox="0 0 100 100"
          >
            <path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" transform="translate(100, 100) rotate(180) " />
          </svg>
        </button>
      )}
    </div>
  );
};
const HomepageSportsCarousel = ({
  activeCarouselSport,
  activeCentralContentTab,
  setActiveCarouselSport,
  setActiveCentralContentTab,
  showContentTabSelector,
}) => {
  const { t } = useTranslation();

  const cmsConfig = useSelector((state) => state.cms.config);
  const sports = useSelector((state) => state.sport.sports);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);
  const sixHoursSportsTreeData = useSelector((state) =>
    state.sportsTree.sportsTreeCache ? state.sportsTree.sportsTreeCache[SIX_HOUR_CACHE_KEY] : undefined,
  );

  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);

  const combinedSportsList = (activeCentralContentTab, sportsTreeData, europeanDashboardLiveData) => {
    let prematch = false;
    let live = false;
    switch (activeCentralContentTab) {
      case "TODAY":
        prematch = true;
        live = true;
        break;
      case "INPLAY":
        live = true;
        break;
      case "UPCOMING":
        prematch = true;
        break;
      case "HIGHLIGHTS":
        prematch = true;
        break;
      default:
        break;
    }

    let sports = [];

    // For upcoming - we use a sports tree relevant to the next 6 hours
    // For any other case - the generic unrestricted sports tree
    const sportsTreeBaseline = activeCentralContentTab === "UPCOMING" ? sixHoursSportsTreeData : sportsTreeData;

    if (prematch && sportsTreeBaseline && sportsTreeBaseline.ept) {
      const prematchSports = sportsTreeBaseline.ept.map((sport) => {
        let eventCount = 0;
        switch (activeCentralContentTab) {
          case "TODAY":
            eventCount = sport.criterias["d0"] ? sport.criterias["d0"] : 0;
            break;
          case "UPCOMING":
            // const d1 = sport.criterias['d1'] ? sport.criterias['d1'] : 0;
            // const d2 = sport.criterias['d2'] ? sport.criterias['d2'] : 0;
            // const d3 = sport.criterias['d3'] ? sport.criterias['d3'] : 0;
            // eventCount = d0 + d1 + d2 + d3;
            eventCount =
              (sport.criterias["d0"] ? sport.criterias["d0"] : 0) + (sport.criterias["d1"] ? sport.criterias["d1"] : 0);
            break;
          case "HIGHLIGHTS":
            const cmsPaths = getHighlightEventPathIds(cmsConfig, sport.code);
            sport.path.forEach((countryPath) => {
              if (cmsPaths.includes(parseInt(countryPath.id, 10))) {
                eventCount += countryPath.eventCount;
              } else {
                countryPath.path.forEach((tournamentPath) => {
                  if (cmsPaths.includes(parseInt(tournamentPath.id, 10))) {
                    eventCount += tournamentPath.eventCount;
                  }
                });
              }
            });
            if (eventCount === 0) return null;
            break;
          default:
            break;
        }

        return { code: sport.code, desc: sport.desc, eventCount };
      });
      sports = sports.concat(prematchSports.filter((f) => f));
    }

    if (live && europeanDashboardLiveData) {
      Object.entries(europeanDashboardLiveData).forEach((entry) => {
        // merge on top of the previous prematch "sports" object
        const sportCode = entry[0];
        const matches = Object.values(entry[1]).filter((match) => match.cStatus !== "END_OF_EVENT");

        const existingSport = sports.find((sport) => sport.code === sportCode);
        if (existingSport) {
          existingSport.eventCount += matches.length;
        } else {
          sports.push({ code: sportCode, desc: sportCode, eventCount: matches.length });
        }
      });
    }

    sports = sports.filter((sport) => sport.eventCount && sport.eventCount > 0);

    return sports;
  };

  const combinedSports = combinedSportsList(activeCentralContentTab, sportsTreeData, europeanDashboardLiveData);

  useEffect(() => {
    if (
      (combinedSports && !activeCarouselSport) ||
      (activeCarouselSport &&
        combinedSports &&
        combinedSports.findIndex((x) => x.code === activeCarouselSport.code) === -1) ||
      combinedSports.find((x) => x.code === activeCarouselSport.code).eventCount !== activeCarouselSport.eventCount
    ) {
      // If the active sport has not been picked, or if there is no content for such sport...
      // init the sport selection to the first one...
      if (combinedSports && combinedSports.length > 0) {
        setActiveCarouselSport(combinedSports[0]);
      }
    }
  }, [combinedSports, activeCarouselSport]);

  const onChangeContentTabHandler = (newActiveTab) => {
    setActiveCentralContentTab(newActiveTab);
    gaEvent("Home Page Content Type Change", "homepage_content_type_change", newActiveTab, undefined, true); // Home page change active tab
  };

  const onSelectSportHandler = (newActiveSport) => {
    setActiveCarouselSport(newActiveSport);
    gaEvent("Sport Change", "sport_change", newActiveSport.code, undefined, true); // Home or live page change active sport
  };

  const inPlayNotAvailable =
    europeanDashboardLiveData &&
    !Object.values(europeanDashboardLiveData).find(
      (sport) => Object.values(sport).findIndex((match) => match.cStatus !== "END_OF_EVENT") > -1,
    );

  return (
    <>
      {showContentTabSelector ? (
        <div className={`${classes["sport-titles"]} ${classes["sport-titles_homepage"]}`}>
          <div
            className={`${classes["sport-title"]} ${
              activeCentralContentTab === "TODAY" ? classes["sport-title_active"] : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => onChangeContentTabHandler("TODAY")}
          >
            {t("todays_matches_page")}
          </div>
          {inPlayNotAvailable ? null : (
            <div
              className={`${classes["sport-title"]} ${
                activeCentralContentTab === "INPLAY" ? classes["sport-title_active"] : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => onChangeContentTabHandler("INPLAY")}
            >
              {t("in_play_page")}
            </div>
          )}
          <div
            className={`${classes["sport-title"]} ${
              activeCentralContentTab === "UPCOMING" ? classes["sport-title_active"] : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => onChangeContentTabHandler("UPCOMING")}
          >
            {t("upcoming")}
          </div>
          <div
            className={`${classes["sport-title"]} ${
              activeCentralContentTab === "HIGHLIGHTS" ? classes["sport-title_active"] : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => onChangeContentTabHandler("HIGHLIGHTS")}
          >
            {t("highlights")}
          </div>
        </div>
      ) : null}

      <SportsCarouselSlider
        activeCarouselSport={activeCarouselSport}
        combinedSports={combinedSports}
        setActiveCarouselSport={onSelectSportHandler}
        sports={sports}
      />
    </>
  );
};

const propTypes = {
  activeCarouselSport: PropTypes.object,
  activeCentralContentTab: PropTypes.string.isRequired,
  setActiveCarouselSport: PropTypes.func.isRequired,
  setActiveCentralContentTab: PropTypes.func.isRequired,
  showContentTabSelector: PropTypes.bool.isRequired,
};
HomepageSportsCarousel.propTypes = propTypes;
HomepageSportsCarousel.defaultProps = { activeCarouselSport: null };

export default React.memo(HomepageSportsCarousel);
