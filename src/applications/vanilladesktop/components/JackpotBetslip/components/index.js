import { faTimesCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetJackpotBetslipDataByJackpotId } from "../../../../../redux/reselect/betslip-selector";
import { submitBetslip } from "../../../../../redux/slices/betslipSlice";
import {
  acknowledgeErrors,
  acknowledgeJackpotSubmission,
  getGlobalPotentialWin,
  getGlobalTotalStake,
  onClearJackpotBetslipHandler,
  onRefreshJackpotBetslipHandler,
  onRemoveJackpotSelectionHandler,
} from "../../../../../utils/betslip-utils";
import BetslipErrorPopup from "../../BetslipPanel/components/BetslipErrorPopup";

import BetslipSuccessPopup from "./BetslipSuccessPopup";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const JackpotBetslip = ({ jackpotId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const getGetJackpotBetslipDataByJackpotId = useMemo(makeGetJackpotBetslipDataByJackpotId, []);
  const betslipData = useSelector((state) => getGetJackpotBetslipDataByJackpotId(state, jackpotId));
  const jackpotSubmitInProgress = useSelector((state) => state.betslip.jackpotSubmitInProgress[jackpotId]);
  const jackpotSubmitError = useSelector((state) => state.betslip.jackpotSubmitError[jackpotId]);
  const jackpotSubmitConfirmation = useSelector((state) => state.betslip.jackpotSubmitConfirmation[jackpotId]);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const currencyCode = useSelector((state) => state.auth.currencyCode);

  const [isOpen, setIsOpen] = useState(true);

  const hasOutcomes = betslipData && betslipData?.model?.outcomes?.length > 0;
  const allOutcomesValid = !betslipData || betslipData?.model?.outcomes?.findIndex((outcome) => !outcome.valid) === -1;

  // Refresh betslips
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (betslipData?.model?.outcomes?.length > 0) {
        // do not refresh while the user is tinkering with the stakes
        onRefreshJackpotBetslipHandler(dispatch, jackpotId);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, betslipData?.model?.outcomes?.length]);

  if (!(betslipData?.model?.outcomes?.length > 0)) {
    return (
      <div className={cx(classes["betting-tickets"])}>
        <div className={classes["betting-tickets__tabs"]}>
          <div className={cx(classes["betting-tickets__tab"], classes["betting-tickets__betslip"], classes["active"])}>
            <div className={classes["betting-tickets__icon"]}>
              <i className={classes["qicon-money"]} />
              <span className={classes["betting-tickets__indicator"]}>
                {betslipData?.model?.outcomes?.length ? betslipData?.model?.outcomes?.length : 0}
              </span>
            </div>
            <h3 className={classes["betting-tickets__title"]}>{t("betslip")}</h3>
            <div
              className={cx(classes["betting-tickets__arrow"], classes["betting-tickets__arrow_betslip"], {
                [classes["active"]]: isOpen,
              })}
              onClick={() => setIsOpen((isOpen) => !isOpen)}
            />
          </div>
        </div>
      </div>
    );
  }

  const eventOutcomes = {};
  let lastEventIndex = 0;
  let lastEventId;
  betslipData?.model?.outcomes?.forEach((outcome) => {
    if (lastEventId !== outcome.eventId) {
      lastEventId = outcome.eventId;
      lastEventIndex += 1;
    }
    eventOutcomes[lastEventIndex] = eventOutcomes[lastEventIndex]
      ? [...eventOutcomes[lastEventIndex], outcome]
      : [outcome];
  });

  return (
    <div className={cx(classes["betting-tickets"], classes["betting-tickets_single"])}>
      <div className={classes["betting-tickets__tabs"]}>
        <div className={cx(classes["betting-tickets__tab"], classes["betting-tickets__betslip"], classes["active"])}>
          <div className={classes["betting-tickets__icon"]}>
            <i className={classes["qicon-money"]} />
            <span className={classes["betting-tickets__indicator"]}>{betslipData.model.outcomes.length}</span>
          </div>
          <h3 className={classes["betting-tickets__title"]}>{t("betslip")}</h3>
          <div
            className={cx(classes["betting-tickets__arrow"], classes["betting-tickets__arrow_betslip"], {
              [classes["active"]]: isOpen,
            })}
            onClick={() => setIsOpen((isOpen) => !isOpen)}
          />
        </div>
      </div>
      <div className={cx(classes["betting-tickets__content"], { [classes["open"]]: isOpen })}>
        <div className={cx(classes["betslip"], { [classes["active"]]: isOpen })}>
          <div className={classes["betslip__body"]}>
            <div className={cx(classes["betslip__single"], classes["active"])}>
              <div className={classes["betslip__cards"]}>
                {Object.values(eventOutcomes).map((outcomes, index) => (
                  <div className={cx(classes["betslip__card"], classes["betslip__card_special"])} key={index}>
                    <div className={classes["betslip__card-container"]}>
                      <div className={classes["betslip__card-head"]}>
                        <span className={classes["betslip__card-title"]}>
                          {outcomes[0].eventDescription ? (
                            outcomes[0].eventDescription
                          ) : (
                            <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                          )}
                        </span>
                      </div>

                      {outcomes.map((outcome, index2) => {
                        if (outcome.outcomeDescription) {
                          return (
                            <div className={classes["betslip__card-body"]} key={index2}>
                              <span
                                className={classes["betslip__card-cross"]}
                                onClick={() => onRemoveJackpotSelectionHandler(dispatch, outcome.outcomeId, jackpotId)}
                              >
                                <FontAwesomeIcon icon={faTimesCircle} />
                              </span>
                              <span className={classes["betslip__card-win"]}>{outcome.outcomeDescription}</span>
                            </div>
                          );
                        }

                        return (
                          <div key={index2} style={{ textAlign: "center" }}>
                            <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className={classes["betslip__bottom"]}>
                <span
                  className={classes["betslip__remove"]}
                  onClick={() => onClearJackpotBetslipHandler(dispatch, jackpotId)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>{t("betslip_panel.remove_all")}</span>
                </span>
                <div className={classes["betslip__summary"]}>
                  <div className={classes["betslip__total"]}>
                    <span>{t("betslip_panel.total_stake")}</span>
                    <span>
                      {betslipData
                        ? `${currencyCode} ${getGlobalTotalStake(betslipData).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          })}`
                        : ""}
                    </span>
                  </div>
                  <div className={classes["betslip__returns"]}>
                    <span>{t("betslip_panel.potential_returns")}</span>
                    <span>
                      {`${currencyCode} ${getGlobalPotentialWin(betslipData)
                        // - getGlobalTotalStake(betslipData)
                        .toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}`}
                    </span>
                  </div>
                  <div className={cx(classes["betslip__confirm"], classes["betslip-popup-activator1"])}>
                    {loggedIn ? (
                      <button
                        disabled={
                          !allOutcomesValid ||
                          !hasOutcomes ||
                          getGlobalTotalStake(betslipData) <= 0 ||
                          jackpotSubmitInProgress
                        }
                        type="button"
                        onClick={() => dispatch(submitBetslip({ jackpotId }))}
                      >
                        {t("betslip_panel.place_bet")}
                      </button>
                    ) : (
                      <button type="button">{t("login")}</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BetslipSuccessPopup
        isOpen={jackpotSubmitConfirmation}
        onClear={() => acknowledgeJackpotSubmission(dispatch, jackpotId)}
      />
      <BetslipErrorPopup
        isOpen={jackpotSubmitError}
        submitError={jackpotSubmitError}
        onClose={() => acknowledgeErrors(dispatch, location.pathname)}
      />
    </div>
  );
};

JackpotBetslip.propTypes = {
  jackpotId: PropTypes.number,
};

JackpotBetslip.defaultProps = {
  jackpotId: undefined,
};

export default JackpotBetslip;
