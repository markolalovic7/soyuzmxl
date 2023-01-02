import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../../../redux/reselect/betslip-selector";
import { getDesktopBetslipMaxSelections } from "../../../../../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../utils/betslip-utils";
import classes from "../../../../../../scss/ollehdesktop.module.scss";

const getRows = (children) => {
  const arrays = [];
  if (children) {
    const size = children.length > 3 ? 2 : children.length; // if size is 2-3, display as is. If the size is > 3, split in groups of 2

    for (let i = 0; i < children.length; i += size) {
      arrays.push(children.slice(i, i + size));
    }
  }

  return arrays;
};

const LiveMarketDetail = ({ eventId, market }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  return getRows(market.outcomes).map((outcomes, rowIndex) => (
    <div className={classes["live__sport-content-bet"]} key={rowIndex}>
      {outcomes.map((outcome, index) => {
        switch (index) {
          case 0:
            return (
              <div
                className={cx(classes["live__sport-content-left"], {
                  [classes["selected"]]: betslipOutcomeIds.includes(outcome.id),
                  [classes["disabled"]]: betslipOutcomeIds.includes(outcome.hidden),
                })}
                key={index}
                onClick={() => toggleBetslipHandler(outcome.id, eventId)}
              >
                <div className={classes["live__sport-content-team"]}>
                  <span>{outcome.desc}</span>
                </div>
                <div className={classes["live__sport-content-odds"]}>
                  {outcome.dir === "<" && <FontAwesomeIcon icon={faArrowDown} style={{ color: "#e24646" }} />}
                  {outcome.dir === ">" && <FontAwesomeIcon icon={faArrowUp} style={{ color: "#6cbb25" }} />}
                  <span>{outcome.price}</span>
                </div>
              </div>
            );
          case 1:
            if (market.outcomes.length === 3) {
              return (
                <div
                  className={cx(classes["live__sport-content-draw"], {
                    [classes["selected"]]: betslipOutcomeIds.includes(outcome.id),
                    [classes["disabled"]]: betslipOutcomeIds.includes(outcome.hidden),
                  })}
                  key={index}
                  onClick={() => toggleBetslipHandler(outcome.id, eventId)}
                >
                  <div className={classes["live__sport-content-team"]}>
                    <span>{outcome.desc}</span>
                  </div>
                  <div className={classes["live__sport-content-odds"]}>
                    {outcome.dir === "<" && <FontAwesomeIcon icon={faArrowDown} style={{ color: "#e24646" }} />}
                    {outcome.dir === ">" && <FontAwesomeIcon icon={faArrowUp} style={{ color: "#6cbb25" }} />}
                    <span>{outcome.price}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                className={cx(classes["live__sport-content-right"], {
                  [classes["selected"]]: betslipOutcomeIds.includes(outcome.id),
                  [classes["disabled"]]: betslipOutcomeIds.includes(outcome.hidden),
                })}
                key={index}
                onClick={() => toggleBetslipHandler(outcome.id, eventId)}
              >
                <div className={classes["live__sport-content-team"]}>
                  <span>{outcome.desc}</span>
                </div>
                <div className={classes["live__sport-content-odds"]}>
                  {outcome.dir === "<" && <FontAwesomeIcon icon={faArrowDown} style={{ color: "#e24646" }} />}
                  {outcome.dir === ">" && <FontAwesomeIcon icon={faArrowUp} style={{ color: "#6cbb25" }} />}
                  <span>{outcome.price}</span>
                </div>
              </div>
            );

          case 2:
            return (
              <div
                className={cx(classes["live__sport-content-right"], {
                  [classes["selected"]]: betslipOutcomeIds.includes(outcome.id),
                  [classes["disabled"]]: betslipOutcomeIds.includes(outcome.hidden),
                })}
                key={index}
                onClick={() => toggleBetslipHandler(outcome.id, eventId)}
              >
                <div className={classes["live__sport-content-team"]}>
                  <span>{outcome.desc}</span>
                </div>
                <div className={classes["live__sport-content-odds"]}>
                  {outcome.dir === "<" && <FontAwesomeIcon icon={faArrowDown} style={{ color: "#e24646" }} />}
                  {outcome.dir === ">" && <FontAwesomeIcon icon={faArrowUp} style={{ color: "#6cbb25" }} />}
                  <span>{outcome.price}</span>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  ));
};

LiveMarketDetail.propTypes = {
  eventId: PropTypes.number.isRequired,
  market: PropTypes.object.isRequired,
};

export default React.memo(LiveMarketDetail);
