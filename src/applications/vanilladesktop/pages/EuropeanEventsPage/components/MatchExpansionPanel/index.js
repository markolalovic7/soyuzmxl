import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../redux/reselect/betslip-selector";
import {
  getDesktopBetslipMaxSelections,
  isDesktopCompactBetslip,
} from "../../../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../utils/betslip-utils";
import { getCmsConfigSportsBook } from "../../../../../../redux/reselect/cms-selector";

const propTypes = {
  coefficientRows: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        coefficientLabel: PropTypes.string.isRequired,
        coefficientValue: PropTypes.number.isRequired,
      }),
    ),
  ).isRequired,
  label: PropTypes.string.isRequired,
  marketId: PropTypes.number.isRequired,
  matchId: PropTypes.number.isRequired,
};

const MatchExpansionPanel = ({ coefficientRows, label, marketId, matchId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const isSmsInfoEnabled = useSelector(getCmsConfigSportsBook)?.data?.smsInfoOn;

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const compactBetslipMode = useSelector(isDesktopCompactBetslip);
  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);

  const [isExpanded, setIsExpanded] = useState(true);

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
      className={cx(classes["match-spoiler"], {
        [classes["active"]]: isExpanded,
      })}
    >
      <div
        className={cx(classes["match-spoiler__body"], {
          [classes["active"]]: isExpanded,
        })}
        onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
      >
        <h3 className={classes["match-spoiler__title"]}>{label}</h3>
        {isSmsInfoEnabled && (
          <span className={classes["match-spoiler__help"]}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </span>
        )}
        <span
          className={cx(classes["match-spoiler__arrow"], {
            [classes["active"]]: isExpanded,
          })}
        />
      </div>
      <div
        className={cx(classes["match-spoiler__content"], {
          [classes["open"]]: isExpanded,
        })}
      >
        {coefficientRows.map((row, index) => (
          <div className={classes["match-spoiler__row"]} key={index}>
            {row.map(({ desc, dir, hidden, id, price }) => (
              <div
                className={cx(classes["coeficient"], {
                  [classes["active"]]: betslipOutcomeIds.includes(id) && !hidden,
                  [classes["disabled"]]: hidden,
                })}
                key={id}
                onClick={() => toggleBetslipHandler(id, matchId)}
              >
                <span className={classes["coeficient__label"]}>{desc}</span>
                <span className={classes["coeficient__numbers"]}>
                  {price}
                  {dir === "d" && (
                    <span className={cx(classes["coeficient__triangle"], classes["coeficient__triangle_red"])} />
                  )}
                  {dir === "u" && (
                    <span className={cx(classes["coeficient__triangle"], classes["coeficient__triangle_green"])} />
                  )}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

MatchExpansionPanel.propTypes = propTypes;

export default MatchExpansionPanel;
