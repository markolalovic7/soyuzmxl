import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../redux/reselect/betslip-selector";
import { getDesktopBetslipMaxSelections, isDesktopCompactBetslip } from "../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../utils/betslip-utils";
import ExpandedMarket from "../ExpandedMarket";

const SelectableCoefficient = ({ eventId, label, outcomeId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);
  const compactBetslipMode = useSelector(isDesktopCompactBetslip);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  return (
    <div
      className={cx(classes["upcoming-match__coeficient"], {
        [classes["active"]]: betslipOutcomeIds.includes(Number(outcomeId)),
      })}
      onClick={() => toggleBetslipHandler(outcomeId, eventId)}
    >
      {label}
    </div>
  );
};
SelectableCoefficient.propTypes = {
  eventId: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  outcomeId: PropTypes.number.isRequired,
};

const UpcomingMatchDropdownPanel = ({ expandByDefault, match }) => {
  const { t } = useTranslation();

  const [isOpened, setIsOpened] = useState(true);
  const [isExpanded, setIsExpanded] = useState(expandByDefault);

  const wdwMarket = Object.values(match.children).find(
    (market) => market.marketTypeGroup === "MONEY_LINE" && (market.periodAbrv === "M" || market.periodAbrv === "RT"),
  );

  return (
    <>
      <div
        className={cx(classes["match-spoiler"], {
          [classes["active"]]: isOpened,
        })}
      >
        <div
          className={cx(classes["match-spoiler__body"], {
            [classes["active"]]: isOpened,
          })}
        >
          <h3 className={classes["match-spoiler__title"]}>
            {`${match.desc} - ${dayjs.unix(match.epoch / 1000).format("D MMMM hh:mm A")}`}
          </h3>
          {!expandByDefault && (
            <span className={classes["match-spoiler__more"]} onClick={() => setIsExpanded((isExpanded) => !isExpanded)}>
              {t("more")}
            </span>
          )}
          <span
            className={cx(classes["match-spoiler__arrow"], {
              [classes["active"]]: isOpened,
            })}
            onClick={() => setIsOpened((isOpened) => !isOpened)}
          />
        </div>
        <div
          className={cx(classes["match-spoiler__content"], {
            [classes["open"]]: isOpened,
          })}
        >
          <div className={classes["match-spoiler__row"]}>
            <div className={classes["upcoming-match"]}>
              {wdwMarket &&
                Object.values(wdwMarket.children).map((outcome) => (
                  <SelectableCoefficient
                    eventId={match.id}
                    key={outcome.id}
                    label={outcome.price}
                    outcomeId={outcome.id}
                  />
                ))}
              <div className={classes["upcoming-match__help"]}>
                <FontAwesomeIcon icon={faQuestionCircle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cx(classes["upcoming-matches__spoilers"], { [classes["active"]]: isExpanded && isOpened })}>
        <div className={classes["upcoming-matches__spoilers-container"]}>
          {Object.values(match.children).map((market, index) => {
            if (index % 2 === 1) return null;

            return <ExpandedMarket eventId={match.id} key={market.id} market={market} />;
          })}
        </div>
        <div className={classes["upcoming-matches__spoilers-container"]}>
          {Object.values(match.children).map((market, index) => {
            if (index % 2 === 0) return null;

            return <ExpandedMarket eventId={match.id} key={market.id} market={market} />;
          })}
        </div>
      </div>
    </>
  );
};

const propTypes = {
  expandByDefault: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
};
UpcomingMatchDropdownPanel.propTypes = propTypes;

export default UpcomingMatchDropdownPanel;
