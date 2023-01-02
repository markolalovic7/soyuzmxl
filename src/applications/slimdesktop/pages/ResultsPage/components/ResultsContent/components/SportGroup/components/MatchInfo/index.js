import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import { openLinkInNewWindow } from "../../../../../../../../../../utils/misc";
import { mapPeriods } from "../../../../../../../../../slimmobile/components/ResultsPage/utils";
import classes from "../../../../../../../../scss/slimdesktop.module.scss";

import MarketInfo from "./components/MarketInfo";

const MatchInfo = ({
  awayResult,
  betradarStatsURL,
  expandedDetails,
  feedCode,
  homeResult,
  id,
  isDetailedLoading,
  isExpanded,
  language,
  onExpand,
  periods,
  players,
  result,
  sportCode,
  time,
}) => {
  const { t } = useTranslation();

  const expandedEventId = expandedDetails && expandedDetails[0]?.categories[0]?.tournaments[0]?.events[0].id;

  return (
    <div className={cx(classes["card"], classes["card-regular"])}>
      <div className={classes["card-regular__head"]}>
        <span className={cx(classes["qicon-default"], classes[`qicon-${sportCode.toLowerCase()}`], classes["icon"])} />
        <span className={classes["card-regular__head-teams"]}>
          <b>{players}</b>
        </span>
        <span className={classes["card-regular__head-time"]}>{time}</span>
      </div>
      <div className={classes["card__results"]}>
        <div
          className={cx(classes["card-result"], classes["card-result--grow"], {
            [classes["active"]]: homeResult > awayResult,
          })}
        >
          <span>{t("home")}</span>
        </div>
        <div
          className={cx(classes["card-result"], classes["card-result--grow"], {
            [classes["active"]]: homeResult === awayResult,
          })}
        >
          {t("draw")}
        </div>
        <div
          className={cx(classes["card-result"], classes["card-result--grow"], {
            [classes["active"]]: homeResult < awayResult,
          })}
        >
          <span>{t("away")}</span>
        </div>
        <div className={classes["card-result--score"]}>
          <b>{result}</b>
        </div>
        {betradarStatsURL && feedCode && (
          <div
            className={classes["card-result--icon"]}
            onClick={() => openLinkInNewWindow(`${betradarStatsURL}/${language}/match/${feedCode}`)}
          >
            <span className={classes["qicon-stats"]} />
          </div>
        )}
        <div
          className={cx(
            classes["card-result--icon"],
            classes["card-result--icon_special"],
            classes["card-result_active-icon"],
            classes["flag-activator"],
            { [classes["open"]]: isExpanded },
          )}
          onClick={onExpand(id)}
        >
          <b>{!isExpanded ? "+" : "-"}</b>
        </div>
      </div>
      <div
        className={cx(classes["content__box-2"], classes["flag"], {
          [classes["open"]]: isExpanded && expandedDetails && expandedEventId === id && !isDetailedLoading,
        })}
      >
        <div className={classes["content-tabs"]}>
          <div className={classes["content-tabs__content"]}>
            <div className={cx(classes["content-tab"], classes["content-tab_active"])} id="tab-1">
              {mapPeriods(expandedDetails).map((period, description) => (
                <MarketInfo key={`${period.id}${description}`} period={period} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  awayResult: PropTypes.number.isRequired,
  betradarStatsURL: PropTypes.string.isRequired,
  expandedDetails: PropTypes.array,
  feedCode: PropTypes.string,
  homeResult: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  isDetailedLoading: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  onExpand: PropTypes.func.isRequired,
  periods: PropTypes.array,
  players: PropTypes.string.isRequired,
  result: PropTypes.string.isRequired,
  sportCode: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

const defaultProps = {
  expandedDetails: null,
  feedCode: undefined,
  periods: null,
};

MatchInfo.propTypes = propTypes;
MatchInfo.defaultProps = defaultProps;

export default React.memo(MatchInfo);
