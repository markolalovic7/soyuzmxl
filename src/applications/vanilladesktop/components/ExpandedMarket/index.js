import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../redux/reselect/betslip-selector";
import { getDesktopBetslipMaxSelections, isDesktopCompactBetslip } from "../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../utils/betslip-utils";
import classes from "../../scss/vanilladesktop.module.scss";

const ExpandedMarket = ({ eventId, market }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);
  const compactBetslipMode = useSelector(isDesktopCompactBetslip);

  const [isOpened, setIsOpened] = useState(true);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  return (
    <div className={cx(classes["match-spoiler"], { [classes["active"]]: isOpened })} key={market.id}>
      <div
        className={cx(classes["match-spoiler__body"], { [classes["active"]]: isOpened })}
        onClick={() => setIsOpened((isOpened) => !isOpened)}
      >
        <h3 className={classes["match-spoiler__title"]}>{`${market.desc} - ${market.period}`}</h3>
        <span className={classes["match-spoiler__phone"]}>
          <i className={classes["qicon-sms-bet"]} />
        </span>
      </div>
      <div className={cx(classes["match-spoiler__content"], { [classes["open"]]: isOpened })}>
        <div
          className={cx(classes["match-spoiler__row"], {
            [classes["match-spoiler__row_special"]]: Object.values(market.children).length > 3,
          })}
        >
          {Object.values(market.children).map((outcome) => (
            <div
              className={cx(
                classes["factor"],
                {
                  [classes["active"]]: betslipOutcomeIds.includes(Number(outcome.id)),
                },
                {
                  [classes["factor_disabled"]]: outcome.hidden || !market.open,
                },
              )}
              key={outcome.id}
              onClick={() => toggleBetslipHandler(outcome.id, eventId)}
            >
              {outcome.dir === "d" && (
                <span className={cx(classes["factor__triangle"], classes["factor__triangle_red"])} />
              )}
              {outcome.dir === "u" && (
                <span className={cx(classes["factor__triangle"], classes["factor__triangle_green"])} />
              )}

              <span className={classes["factor__team"]}>
                <span>{outcome.desc}</span>
              </span>
              <div className={classes["factor__numbers"]}>
                <span className={classes["factor__number"]}>{outcome.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ExpandedMarket.propTypes = {
  eventId: PropTypes.number.isRequired,
  market: PropTypes.object.isRequired,
};

export default ExpandedMarket;
