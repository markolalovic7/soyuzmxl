import cx from "classnames";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import useScrollLock from "use-scroll-lock";

import { makeGetBetslipOutcomeIds } from "../../../../redux/reselect/betslip-selector";
import { acknowledgeErrors, onRefreshBetslipHandler, onToggleSelection } from "../../../../utils/betslip-utils";
import classes from "../../scss/ezbet.module.scss";

import CloseRedSvg from "applications/ezbet/img/icons/close-red.svg";

const BetslipErrorModal = ({ message, onClose }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(classes["confirmation-modal"], classes["confirm-error-modal"], classes["max-selections"])}
      id="confirmation-modal"
      style={{ display: "flex" }}
    >
      <div className={classes["modal-content"]}>
        <div className={classes["modal-body"]}>
          <i className={classes["ez-check-icon"]}>
            <img alt="White Check in blue circle" src={CloseRedSvg} />
          </i>
          <div>
            <p className={classes["warning"]} style={{ color: "#E32323", marginBottom: "11px" }}>
              {t("betslip_panel.unable_place_bet")}
            </p>
            <p>{message}</p>
          </div>
          <div className={cx(classes["modal-footer"], classes["flex-al-center"])}>
            <button className={cx(classes["primary"], classes["confirmation-button"])} type="button" onClick={onClose}>
              {t("ok")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BetslipErrorModal.propTypes = { message: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired };

const propTypes = {
  desc: PropTypes.string.isRequired,
  dir: PropTypes.string,
  eventId: PropTypes.number.isRequired,
  hidden: PropTypes.bool.isRequired,
  isDraw: PropTypes.bool.isRequired,
  outcomeId: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
};

const defaultProps = {
  dir: undefined,
};

const OutcomePrice = ({ desc, dir, eventId, hidden, isDraw, outcomeId, price }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = 20; // ???
  const compactBetslipMode = false;
  const [maxSelections, setMaxSelections] = React.useState(false);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length >= maxBetslipSelections && !betslipOutcomeIds.find((x) => x === outcomeId)) {
      // alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
      setMaxSelections(true);
    } else {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  function onClose() {
    setMaxSelections(false);
  }

  useScrollLock(maxSelections);

  return (
    <>
      {maxSelections && (
        <BetslipErrorModal
          message={t("betslip_panel.too_many_selections", { value: maxBetslipSelections })}
          onClose={() => {
            acknowledgeErrors(dispatch, location.pathname);
            onClose();
          }}
        />
      )}
      <div
        className={cx(classes["forecast"], {
          [classes["x-option"]]: isDraw,
        })}
        key={outcomeId}
      >
        {hidden && (
          <div className={classes["forecast-selection-suspended"]}>
            <span className={classes["icon-lock"]} />
          </div>
        )}
        <div
          className={cx(classes["forecast-content"], classes["reduced-spacing"], {
            [classes["forecast-active"]]: betslipOutcomeIds.includes(outcomeId) && !hidden,
          })}
          onClick={() => toggleBetslipHandler(outcomeId, eventId)}
        >
          <div>
            <p>{desc}</p>
            <p>{price}</p>
          </div>
          {dir === "u" && (
            // <AnimateKeyframes play duration="0.5" iterationCount="10" keyframes={["opacity: 1", "opacity: 0"]}>
            <i
              className={cx(classes["ez-icon-indicator"], classes["icon-up-green"], classes["arrow-blink-animation"])}
            />
            // </AnimateKeyframes>
          )}
          {dir === "d" && (
            // <AnimateKeyframes play duration="0.5" iterationCount="10" keyframes={["opacity: 1", "opacity: 0"]}>
            <i
              className={cx(classes["ez-icon-indicator"], classes["icon-down-red"], classes["arrow-blink-animation"])}
            />
            // </AnimateKeyframes>
          )}
        </div>
      </div>
    </>
  );
};

OutcomePrice.propTypes = propTypes;
OutcomePrice.defaultProps = defaultProps;

export default React.memo(OutcomePrice);
