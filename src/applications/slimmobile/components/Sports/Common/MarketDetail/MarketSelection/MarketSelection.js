import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../../redux/reselect/betslip-selector";
import { getMobileBetslipMaxSelections } from "../../../../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../utils/betslip-utils";

import DrawOutcome from "./DrawOutcome/DrawOutcome";
import LeftOutcome from "./LeftOutcome/LeftOutcome";
import RightOutcome from "./RightOutcome/RightOutcome";

const propTypes = {
  eventId: PropTypes.string.isRequired,
  market: PropTypes.object.isRequired,
};

const defaultProps = {};

const MarketSelection = ({ eventId, market }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getMobileBetslipMaxSelections);

  const addToBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  const isWinDrawWin = (market) =>
    market.marketTypeGroup === "MONEY_LINE" && market.children && Object.values(market.children).length === 3;

  const getRows = (children) => {
    const size = 2;
    const arrays = [];
    if (children) {
      for (let i = 0; i < children.length; i += size) {
        arrays.push(children.slice(i, i + size));
      }
    }

    return arrays;
  };

  function selections(market) {
    if (market.children) {
      const childrenArray = Object.values(market.children);
      if (isWinDrawWin(market)) {
        const home = childrenArray[0];
        const draw = childrenArray[1];
        const away = childrenArray[2];

        return (
          <div className={classes["matches__row"]} key={market.id}>
            <LeftOutcome
              active={betslipOutcomeIds.includes(parseInt(home.id, 10))}
              addToBetslipHandler={addToBetslipHandler}
              disabled={home.hidden || !market.open}
              eventId={eventId}
              outcome={home}
            />
            <DrawOutcome
              active={betslipOutcomeIds.includes(parseInt(draw.id, 10))}
              addToBetslipHandler={addToBetslipHandler}
              disabled={draw.hidden || !market.open}
              eventId={eventId}
              outcome={draw}
            />
            <RightOutcome
              active={betslipOutcomeIds.includes(parseInt(away.id, 10))}
              addToBetslipHandler={addToBetslipHandler}
              disabled={away.hidden || !market.open}
              eventId={eventId}
              outcome={away}
            />
          </div>
        );
      }
      const rows = getRows(childrenArray); // split in 2 outcomes per row (for as many rows as required...

      return rows.map((twoOutcomes, index) => (
        <div className={classes["matches__row"]} key={`${market.id}-${index}`}>
          <LeftOutcome
            active={betslipOutcomeIds.includes(parseInt(twoOutcomes[0].id, 10))}
            addToBetslipHandler={addToBetslipHandler}
            disabled={twoOutcomes[0].hidden || !market.open}
            eventId={eventId}
            outcome={twoOutcomes[0]}
          />
          {twoOutcomes.length === 2 ? (
            <RightOutcome
              active={betslipOutcomeIds.includes(parseInt(twoOutcomes[1].id, 10))}
              addToBetslipHandler={addToBetslipHandler}
              disabled={twoOutcomes[1].hidden || !market.open}
              eventId={eventId}
              outcome={twoOutcomes[1]}
            />
          ) : null}
        </div>
      ));
    }

    return null;
  }

  return selections(market);
};

MarketSelection.propTypes = propTypes;
MarketSelection.defaultProps = defaultProps;

export default memo(MarketSelection);
