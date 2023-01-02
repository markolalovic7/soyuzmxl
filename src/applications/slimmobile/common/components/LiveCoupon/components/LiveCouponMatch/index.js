import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { CSSTransition } from "react-transition-group";
import {
  getCmsLayoutMobileSlimLiveWidgetMatchTracker,
  getMobileBetslipMaxSelections,
} from "redux/reselect/cms-layout-widgets";
import { openLinkInNewWindow } from "utils/misc";

import { makeGetBetslipOutcomeIds } from "../../../../../../../redux/reselect/betslip-selector";
import { getImg } from "../../../../../../../utils/bannerHelpers";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../utils/betslip-utils";
import LiveCouponMatchClockAndPeriod from "../LiveCouponMatchClockAndPeriod";
import LiveEventDetails from "../LiveEventDetails";

const propTypes = {
  activeMatchId: PropTypes.number,
  match: PropTypes.object.isRequired,
  setActiveMatchId: PropTypes.func.isRequired,
};

const LiveCouponMatch = ({ activeMatchId, match, setActiveMatchId }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getMobileBetslipMaxSelections);
  const matchTrackerWidget = useSelector(getCmsLayoutMobileSlimLiveWidgetMatchTracker);

  const dispatch = useDispatch();

  const eventExpandHandler = () => {
    setActiveMatchId(match.eventId); // register this one as active, so the markets expand
  };

  const toggleBetslipSelectionHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  const selectionCards = (match) => {
    const market = Object.values(match.markets).length > 0 ? Object.values(match.markets)[0] : null;

    if (market && market.sels.length > 0) {
      const selections = market.sels.map((selection) => {
        const disabled = match.hidden || !market.mOpen || selection.hidden;

        return (
          <div
            className={`${classes["result__card"]} ${
              betslipOutcomeIds.includes(parseInt(selection.oId, 10)) ? classes["active"] : ""
            } ${disabled ? classes["disabled"] : ""} ${classes["price-indicator"]} `}
            key={selection.oId}
            onClick={() => toggleBetslipSelectionHandler(selection.oId, match.eventId)}
          >
            {selection.dir ? (
              selection.dir === "<" ? (
                <span
                  className={`${classes["price-indicator__triangle"]} ${classes["price-indicator__triangle_red"]}`}
                />
              ) : selection.dir === ">" ? (
                <span
                  className={`${classes["price-indicator__triangle"]} ${classes["price-indicator__triangle_green"]}`}
                />
              ) : null
            ) : null}
            <span>{selection.oDesc}</span>
            <span>{selection.formattedPrice}</span>
          </div>
        );
      });

      return selections;
    }

    return (
      <>
        <div className={`${classes["result__card"]} ${classes["disabled"]}`} key={1}>
          <span>Home</span>
          <span>---</span>
        </div>
        <div className={`${classes["result__card"]} ${classes["disabled"]}`} key={2}>
          <span>Away</span>
          <span>---</span>
        </div>
      </>
    );
  };

  return (
    <div className={classes["result__body"]}>
      <div className={classes["result__item"]}>
        <div className={classes["result__match"]}>
          <div className={classes["result__img"]}>
            <img alt="match" src={getImg(match.sport)} />
          </div>

          <div className={classes["result__match-container"]}>
            <div className={classes["result__team"]}>{match.opADesc}</div>
            <div className={classes["result__team-score"]}>{match.hScore ? match.hScore : 0}</div>

            <LiveCouponMatchClockAndPeriod match={match} />

            <div className={classes["result__team-score"]}>{match.aScore ? match.aScore : 0}</div>
            <div className={classes["result__team"]}>{match.opBDesc}</div>
          </div>
        </div>
        <div className={`${classes["result__cards"]} ${classes["result__cards_live"]}`}>
          {selectionCards(match)}

          {match.feedCode &&
          matchTrackerWidget?.data?.mode === "BETRADAR" &&
          matchTrackerWidget?.data?.sports?.includes(match?.sport) ? (
            <div
              className={`${classes["result__card"]} ${classes["result__card_icon"]}`}
              onClick={() =>
                openLinkInNewWindow(
                  `https://s5.sir.sportradar.com/p8tech/en/match/${match.feedCode.substring(
                    match.feedCode.lastIndexOf(":") + 1,
                    match.feedCode.length,
                  )}`,
                )
              }
            >
              <i className={classes["qicon-stats"]} />
            </div>
          ) : null}
        </div>
        {match.mCount > 1 ? (
          <div
            className={`${classes["live-expanded"]} ${activeMatchId === match.eventId ? classes["active"] : ""}`}
            onClick={() => eventExpandHandler(match.eventId)}
          >
            {`+${match.mCount - 1}`}
          </div>
        ) : null}
      </div>
      {activeMatchId === match.eventId ? (
        <CSSTransition
          appear
          in
          classNames={{
            appear: classes["react-css-animation-appear"],
            appearActive: classes["react-css-animation-appear-active"],
            enter: classes["react-css-animation-enter"],
            enterActive: classes["react-css-animation-enter-active"],
            exit: classes["react-css-animation-exit"],
            exitActive: classes["react-css-animation-exit-active"],
          }}
          timeout={1000}
        >
          <LiveEventDetails
            eventId={match.eventId}
            feedcode={match.feedCode}
            mainMarketId={
              match && match.markets && match.markets.length > 0 ? Object.values(match.markets)[0].mId : null
            }
          />
        </CSSTransition>
      ) : null}
    </div>
  );
};

LiveCouponMatch.propTypes = propTypes;
LiveCouponMatch.defaultProps = { activeMatchId: undefined };

export default React.memo(LiveCouponMatch);
