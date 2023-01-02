import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import { SUPPORTED_CUSTOM_BET_SPORTS } from "../../../../../utils/custom-bet-utils";
import CustomBetInfoButton from "applications/citydesktop/img/icons/CustomBetInfoButton";

const propTypes = {
  activeTab: PropTypes.string.isRequired,
  brMatchId: PropTypes.string,
  cmsFilterEnabled: PropTypes.bool.isRequired,
  cmsFilterOn: PropTypes.bool.isRequired,
  markets: PropTypes.array.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setCmsFilterOn: PropTypes.func.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {
  brMatchId: undefined,
};

const EventDetailPageLinks = ({
  activeTab,
  brMatchId,
  cmsFilterEnabled,
  cmsFilterOn,
  markets,
  setActiveTab,
  setCmsFilterOn,
  sportCode,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    // protect against users navigating to another sport after having selected the custom bet tab
    if (activeTab === "CUSTOM_BET" && !SUPPORTED_CUSTOM_BET_SPORTS.includes(sportCode)) {
      setActiveTab("ALL");
    }
  }, [activeTab, sportCode]);

  const [showCustomInfo, setShowCustomInfo] = useState(false);

  const allMarketCount = markets.length;
  const matchMarketCount = markets.filter(
    (market) => market.marketTypeGroup === "MONEY_LINE" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
  ).length;
  const overUnderMarketCount = markets.filter(
    (market) =>
      (market.marketTypeGroup === "FIXED_TOTAL" || market.marketTypeGroup === "THREE_WAY_FIXED_TOTAL") &&
      (market.periodAbrv === "M" || market.periodAbrv === "RT"),
  ).length;
  const handicapMarketCount = markets.filter(
    (market) =>
      (market.marketTypeGroup === "FIXED_SPREAD" || market.marketTypeGroup === "THREE_WAY_FIXED_SPREAD") &&
      (market.periodAbrv === "M" || market.periodAbrv === "RT"),
  ).length;
  const oddEvenMarketCount = markets.filter(
    (market) => market.marketTypeGroup === "ODD_EVEN" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
  ).length;
  const periodMarketCount = markets.filter((market) => market.periodAbrv !== "M" && market.periodAbrv !== "RT").length;
  const rapidMarketCount = markets.filter((market) => market.rapid).length;
  const otherMarketCount =
    allMarketCount -
    matchMarketCount -
    overUnderMarketCount -
    handicapMarketCount -
    oddEvenMarketCount -
    periodMarketCount -
    rapidMarketCount;



  return (
    <div className={classes["links"]}>
      <div
        className={`${classes["links__item"]} ${activeTab === "ALL" ? classes["links__item_active"] : allMarketCount > 0 ? classes["links__item_enabled"] : ""
          }`}
        style={{
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      >
        <div className={cx(classes["flex-center"], classes['links__item'])}>
          <label className={cx(classes["switch"], classes["cash-out-switch"])} htmlFor="market-filter-out-switch">
            <input
              checked={cmsFilterOn}
              disabled={!cmsFilterEnabled}
              id="market-filter-out-switch"
              type="checkbox"
              onChange={() => setCmsFilterOn(!cmsFilterOn)}
            />
            <span className={cx(classes["switch-slider"], classes["round"])} />
          </label>
          <span
            className={cx(
              classes["switch-label"],
              { [classes["active"]]: cmsFilterOn },
              { [classes["disabled"]]: !cmsFilterEnabled },
            )}
          >
            {t("city.bet_filter")}
          </span>
        </div>
        {SUPPORTED_CUSTOM_BET_SPORTS.includes(sportCode) && (
          <div
            className={`${classes["links__item"]} ${classes["links__item_enabled"]} ${classes["custom-bet-button"]} ${activeTab === "CUSTOM_BET" ? classes["links__item_active"] : ""}`}
            style={{
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            <div className={classes["custom-bet-info"]}>
              <span className={classes["custom-bet-ifo-icon"]} />
              <em>{t("city.pages.event_detail.custom_bet_info")}</em>
            </div>
            <span onClick={() => setActiveTab("CUSTOM_BET")}>{t("city.pages.event_detail.custom_bet")}</span>
          </div>
        )}
      </div>
      <div
        className={`${classes["links__item"]} ${activeTab === "ALL" ? classes["links__item_active"] : allMarketCount > 0 ? classes["links__item_enabled"] : ""
          }`}
        style={{
          cursor: allMarketCount > 0 ? "pointer" : "none",
          pointerEvents: allMarketCount > 0 ? "auto" : "none",
        }}
        onClick={() => setActiveTab("ALL")}
      >
        {t("city.pages.event_detail.all", { number: allMarketCount })}
      </div>
      <div
        className={`${classes["links__item"]} ${activeTab === "MATCH"
          ? classes["links__item_active"]
          : matchMarketCount > 0
            ? classes["links__item_enabled"]
            : ""
          }`}
        style={{
          cursor: matchMarketCount > 0 ? "pointer" : "none",
          pointerEvents: matchMarketCount > 0 ? "auto" : "none",
        }}
        onClick={() => setActiveTab("MATCH")}
      >
        {t("city.pages.event_detail.match", { number: matchMarketCount })}
      </div>
      <div
        className={`${classes["links__item"]} ${activeTab === "OVER_UNDER"
          ? classes["links__item_active"]
          : overUnderMarketCount > 0
            ? classes["links__item_enabled"]
            : ""
          }`}
        style={{
          cursor: overUnderMarketCount > 0 ? "pointer" : "none",
          pointerEvents: overUnderMarketCount > 0 ? "auto" : "none",
        }}
        onClick={() => setActiveTab("OVER_UNDER")}
      >
        {t("city.pages.event_detail.over_under", {
          number: overUnderMarketCount,
        })}
      </div>
      <div
        className={`${classes["links__item"]} ${activeTab === "HANDICAP"
          ? classes["links__item_active"]
          : handicapMarketCount > 0
            ? classes["links__item_enabled"]
            : ""
          }`}
        style={{
          cursor: handicapMarketCount > 0 ? "pointer" : "none",
          pointerEvents: handicapMarketCount > 0 ? "auto" : "none",
        }}
        onClick={() => setActiveTab("HANDICAP")}
      >
        {t("city.pages.event_detail.handicap", {
          number: handicapMarketCount,
        })}
      </div>
      <div
        className={`${classes["links__item"]} ${activeTab === "ODD_EVEN"
          ? classes["links__item_active"]
          : oddEvenMarketCount > 0
            ? classes["links__item_enabled"]
            : ""
          }`}
        style={{
          cursor: oddEvenMarketCount > 0 ? "pointer" : "none",
          pointerEvents: oddEvenMarketCount > 0 ? "auto" : "none",
        }}
        onClick={() => setActiveTab("ODD_EVEN")}
      >
        {t("city.pages.event_detail.odd_even", {
          number: oddEvenMarketCount,
        })}
      </div>
      <div
        className={`${classes["links__item"]} ${activeTab === "PERIOD"
          ? classes["links__item_active"]
          : periodMarketCount > 0
            ? classes["links__item_enabled"]
            : ""
          }`}
        style={{
          cursor: periodMarketCount > 0 ? "pointer" : "none",
          pointerEvents: periodMarketCount > 0 ? "auto" : "none",
        }}
        onClick={() => setActiveTab("PERIOD")}
      >
        {t("city.pages.event_detail.periods", {
          number: periodMarketCount,
        })}
      </div>
      {
        rapidMarketCount > 0 ? (
          <div
            className={`${classes["links__item"]} ${activeTab === "RAPID"
              ? classes["links__item_active"]
              : rapidMarketCount > 0
                ? classes["links__item_enabled"]
                : ""
              }`}
            style={{
              cursor: rapidMarketCount > 0 ? "pointer" : "none",
              pointerEvents: rapidMarketCount > 0 ? "auto" : "none",
            }}
            onClick={() => setActiveTab("RAPID")}
          >
            {t("city.pages.event_detail.rapid", {
              number: rapidMarketCount,
            })}
          </div>
        ) : null
      }
      <div
        className={`${classes["links__item"]} ${activeTab === "OTHER"
          ? classes["links__item_active"]
          : otherMarketCount > 0
            ? classes["links__item_enabled"]
            : ""
          }`}
        style={{
          cursor: otherMarketCount > 0 ? "pointer" : "none",
          pointerEvents: otherMarketCount > 0 ? "auto" : "none",
        }}
        onClick={() => setActiveTab("OTHER")}
      >
        {t("city.pages.event_detail.others", {
          number: otherMarketCount,
        })}
      </div>
    </div >
  );
};

EventDetailPageLinks.propTypes = propTypes;
EventDetailPageLinks.defaultProps = defaultProps;

export default React.memo(EventDetailPageLinks);
