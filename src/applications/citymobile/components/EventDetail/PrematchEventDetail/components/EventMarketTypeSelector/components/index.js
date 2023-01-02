import CustomBetInfoButton from "applications/citymobile/img/icons/CustomBetInfoButton";
import cx from "classnames";
import * as PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { SUPPORTED_CUSTOM_BET_SPORTS } from "../../../../../../../../utils/custom-bet-utils";
import classes from "../../../../../../scss/citymobile.module.scss";

const EventMarketTypeSelector = ({
  activeTab,
  allMarketCount,
  cmsFilterEnabled,
  cmsFilterOn,
  handicapMarketCount,
  matchMarketCount,
  oddEvenMarketCount,
  otherMarketCount,
  overUnderMarketCount,
  periodMarketCount,
  rapidMarketCount,
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

  return (
    <div className={classes["links"]}>
      <div className={`${classes["links__item"]} ${classes["links__item_active"]}`}>
        <div className={classes["flex-center"]}>
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
      </div>
      {SUPPORTED_CUSTOM_BET_SPORTS.includes(sportCode) && (
        <div
          className={`${classes["links__item"]} ${classes["custom-bet-button"]} ${activeTab === "CUSTOM_BET" ? classes["links__item_active"] : ""}`}
        >
          <div className={classes["custom-bet-info"]}>
            <span className={classes["custom-bet-ifo-icon"]} />
            <em>{t("city.pages.event_detail.custom_bet_info")}</em>
          </div>
          <span onClick={() => setActiveTab("CUSTOM_BET")}>{t("city.pages.event_detail.custom_bet")}</span>
        </div>
      )}
      <div className={classes["scrollable-links"]}>
        <div
          className={`${classes["links__item"]} ${activeTab === "ALL" ? classes["links__item_active"] : ""}`}
          onClick={() => setActiveTab("ALL")}
        >
          <span>{t("city.pages.event_detail.all", { number: allMarketCount })}</span>
        </div>
        <div
          className={`${classes["links__item"]} ${activeTab === "MATCH" ? classes["links__item_active"] : ""}`}
          onClick={() => setActiveTab("MATCH")}
        >
          <span>{t("city.pages.event_detail.match", { number: matchMarketCount })}</span>
        </div>
        <div
          className={`${classes["links__item"]} ${activeTab === "OVER_UNDER" ? classes["links__item_active"] : ""}`}
          onClick={() => setActiveTab("OVER_UNDER")}
        >
          <span>{t("city.pages.event_detail.over_under", { number: overUnderMarketCount })}</span>
        </div>
        <div
          className={`${classes["links__item"]} ${activeTab === "HANDICAP" ? classes["links__item_active"] : ""}`}
          onClick={() => setActiveTab("HANDICAP")}
        >
          <span>{t("city.pages.event_detail.handicap", { number: handicapMarketCount })}</span>
        </div>
        <div
          className={`${classes["links__item"]} ${activeTab === "ODD_EVEN" ? classes["links__item_active"] : ""}`}
          onClick={() => setActiveTab("ODD_EVEN")}
        >
          <span>{t("city.pages.event_detail.odd_even", { number: oddEvenMarketCount })}</span>
        </div>
        <div
          className={`${classes["links__item"]} ${activeTab === "PERIOD" ? classes["links__item_active"] : ""}`}
          onClick={() => setActiveTab("PERIOD")}
        >
          <span>{t("city.pages.event_detail.periods", { number: periodMarketCount })}</span>
        </div>
        {rapidMarketCount > 0 ? (
          <div
            className={`${classes["links__item"]} ${activeTab === "RAPID" ? classes["links__item_active"] : ""}`}
            onClick={() => setActiveTab("RAPID")}
          >
            <span>{t("city.pages.event_detail.rapid", { number: rapidMarketCount })}</span>
          </div>
        ) : null}
        <div
          className={`${classes["links__item"]} ${activeTab === "OTHER" ? classes["links__item_active"] : ""}`}
          onClick={() => setActiveTab("OTHER")}
        >
          <span>{t("city.pages.event_detail.others", { number: otherMarketCount })}</span>
        </div>
      </div>
    </div>
  );
};

EventMarketTypeSelector.propTypes = {
  activeTab: PropTypes.string.isRequired,
  allMarketCount: PropTypes.number.isRequired,
  cmsFilterEnabled: PropTypes.bool.isRequired,
  cmsFilterOn: PropTypes.bool.isRequired,
  handicapMarketCount: PropTypes.number.isRequired,
  matchMarketCount: PropTypes.number.isRequired,
  oddEvenMarketCount: PropTypes.number.isRequired,
  otherMarketCount: PropTypes.number.isRequired,
  overUnderMarketCount: PropTypes.number.isRequired,
  periodMarketCount: PropTypes.number.isRequired,
  rapidMarketCount: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setCmsFilterOn: PropTypes.func.isRequired,
  sportCode: PropTypes.string.isRequired,
};

export default React.memo(EventMarketTypeSelector);
