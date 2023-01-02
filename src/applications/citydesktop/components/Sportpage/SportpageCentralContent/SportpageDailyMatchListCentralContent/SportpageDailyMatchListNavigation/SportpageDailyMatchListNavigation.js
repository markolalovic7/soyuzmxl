import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getAuthTimezoneOffset } from "redux/reselect/auth-selector";

import classes from "../../../../../scss/citywebstyle.module.scss";

const SportpageDailyMatchListNavigation = (props) => {
  const { t } = useTranslation();

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);
  const timezoneOffset = useSelector(getAuthTimezoneOffset);

  const criterias =
    sportsTreeData && sportsTreeData.ept
      ? Object.values(sportsTreeData.ept).find((sportSubTree) => sportSubTree.code === props.activeCarouselSport)
          .criterias
      : null;

  const tempGameAllowed = criterias ? Object.keys(criterias).filter((c) => c !== "oc").length > 0 : false;

  useEffect(() => {
    if (criterias && props.activeCentralContentTab === "DAILY_MATCH_LIST") {
      // make sure we default to the first available one...
      if (criterias.d0) {
        props.setActiveDateTab(0);
      } else if (criterias.d1) {
        props.setActiveDateTab(1);
      } else if (criterias.d2) {
        props.setActiveDateTab(2);
      } else if (criterias.d3) {
        props.setActiveDateTab(3);
      } else if (criterias.d4) {
        props.setActiveDateTab(4);
      } else if (criterias.d5) {
        props.setActiveDateTab(5);
      } else if (criterias.d6) {
        props.setActiveDateTab(6);
      }
    }
  }, [criterias, props.activeCentralContentTab]);

  // INPLAY, TOP_LEAGUES, ALL_LEAGUES, DAILY_MATCH_LIST
  return (
    <div>
      <div className={classes["links"]}>
        {criterias && criterias.live ? (
          <div
            className={`${classes["links__item"]} ${
              props.activeCentralContentTab === "INPLAY" ? classes["links__item_active"] : ""
            }`}
            onClick={() => props.setActiveCentralContentTab("INPLAY")}
          >
            {t("in_play_page")}
          </div>
        ) : null}
        <div
          className={`${classes["links__item"]} ${
            props.activeCentralContentTab === "TOP_LEAGUES" ? classes["links__item_active"] : ""
          }`}
          onClick={() => props.setActiveCentralContentTab("TOP_LEAGUES")}
        >
          {t("top_leagues_page")}
        </div>
        <div
          className={`${classes["links__item"]} ${
            props.activeCentralContentTab === "ALL_LEAGUES" ? classes["links__item_active"] : ""
          }`}
          onClick={() => props.setActiveCentralContentTab("ALL_LEAGUES")}
        >
          {t("all_leagues_page")}
        </div>

        {tempGameAllowed ? (
          <div
            className={`${classes["links__item"]} ${
              props.activeCentralContentTab === "DAILY_MATCH_LIST" ? classes["links__item_active"] : ""
            }`}
            onClick={() => props.setActiveCentralContentTab("DAILY_MATCH_LIST")}
          >
            {t("daily_match_list_page")}
          </div>
        ) : null}
      </div>
      {props.activeCentralContentTab === "DAILY_MATCH_LIST" && criterias ? (
        <div className={classes["calendar"]}>
          {criterias["d0"] ? (
            <div
              className={`${classes["calendar__item"]} ${props.activeDateTab === 0 ? classes["active"] : ""}`}
              onClick={() => props.setActiveDateTab(0)}
            >
              <span className={classes["calendar__title"]}>
                {dayjs().utcOffset(timezoneOffset).add(0, "day").calendar().split(" ")[0]}
              </span>
              <div className={classes["calendar__day"]}>
                {dayjs().utcOffset(timezoneOffset).add(0, "day").format("MMMM DD")}
              </div>
            </div>
          ) : null}
          {criterias["d1"] ? (
            <div
              className={`${classes["calendar__item"]} ${props.activeDateTab === 1 ? classes["active"] : ""}`}
              onClick={() => props.setActiveDateTab(1)}
            >
              <span className={classes["calendar__title"]}>
                {dayjs().utcOffset(timezoneOffset).add(1, "day").calendar().split(" ")[0]}
              </span>
              <div className={classes["calendar__day"]}>
                {dayjs().utcOffset(timezoneOffset).add(1, "day").format("MMMM DD")}
              </div>
            </div>
          ) : null}
          {criterias["d2"] ? (
            <div
              className={`${classes["calendar__item"]} ${props.activeDateTab === 2 ? classes["active"] : ""}`}
              onClick={() => props.setActiveDateTab(2)}
            >
              <span className={classes["calendar__title"]}>
                {dayjs().utcOffset(timezoneOffset).add(2, "day").calendar().split(" ")[0]}
              </span>
              <div className={classes["calendar__day"]}>
                {dayjs().utcOffset(timezoneOffset).add(2, "day").format("MMMM DD")}
              </div>
            </div>
          ) : null}
          {criterias["d3"] ? (
            <div
              className={`${classes["calendar__item"]} ${props.activeDateTab === 3 ? classes["active"] : ""}`}
              onClick={() => props.setActiveDateTab(3)}
            >
              <span className={classes["calendar__title"]}>
                {dayjs().utcOffset(timezoneOffset).add(3, "day").calendar().split(" ")[0]}
              </span>
              <div className={classes["calendar__day"]}>
                {dayjs().utcOffset(timezoneOffset).add(3, "day").format("MMMM DD")}
              </div>
            </div>
          ) : null}
          {criterias["d4"] ? (
            <div
              className={`${classes["calendar__item"]} ${props.activeDateTab === 4 ? classes["active"] : ""}`}
              onClick={() => props.setActiveDateTab(4)}
            >
              <span className={classes["calendar__title"]}>
                {dayjs().utcOffset(timezoneOffset).add(4, "day").calendar().split(" ")[0]}
              </span>
              <div className={classes["calendar__day"]}>
                {dayjs().utcOffset(timezoneOffset).add(4, "day").format("MMMM DD")}
              </div>
            </div>
          ) : null}
          {criterias["d5"] ? (
            <div
              className={`${classes["calendar__item"]} ${props.activeDateTab === 5 ? classes["active"] : ""}`}
              onClick={() => props.setActiveDateTab(5)}
            >
              <span className={classes["calendar__title"]}>
                {dayjs().utcOffset(timezoneOffset).add(5, "day").calendar().split(" ")[0]}
              </span>
              <div className={classes["calendar__day"]}>
                {dayjs().utcOffset(timezoneOffset).add(5, "day").format("MMMM DD")}
              </div>
            </div>
          ) : null}
          {criterias["d6"] ? (
            <div
              className={`${classes["calendar__item"]} ${props.activeDateTab === 6 ? classes["active"] : ""}`}
              onClick={() => props.setActiveDateTab(6)}
            >
              <span className={classes["calendar__title"]}>
                {dayjs().utcOffset(timezoneOffset).add(6, "day").calendar().split(" ")[0]}
              </span>
              <div className={classes["calendar__day"]}>
                {dayjs().utcOffset(timezoneOffset).add(6, "day").format("MMMM DD")}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(SportpageDailyMatchListNavigation);
