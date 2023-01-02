import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/betpoint/scss/betpoint.module.scss";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";

import {
  makeGetBetslipData,
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
  makeGetBetslipSubmitInProgress,
} from "../../../../../redux/reselect/betslip-selector";
import {
  acknowledgeErrors,
  acknowledgeSubmission,
  getGlobalPotentialWin,
  getGlobalTotalStake,
  onRefreshBetslipHandler,
  onRemoveSelectionHandler,
  onSpecificStakeChangeHandler,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
} from "../../../../../utils/betslip-utils";
import Header from "../../../components/Header";

const BetslipPage = () => {
  const { betTypeId: betTypeIdStr } = useParams();
  const betTypeId = Number(betTypeIdStr);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const getSubmitInProgress = useMemo(makeGetBetslipSubmitInProgress, []);
  const submitInProgress = useSelector((state) => getSubmitInProgress(state, location.pathname));

  const getBetslipSubmitError = useMemo(makeGetBetslipSubmitError, []);
  const submitError = useSelector((state) => getBetslipSubmitError(state, location.pathname));

  const getBetslipSubmitConfirmation = useMemo(makeGetBetslipSubmitConfirmation, []);
  const submitConfirmation = useSelector((state) => getBetslipSubmitConfirmation(state, location.pathname));

  const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const currencyCode = useSelector((state) => state.auth.currencyCode);

  const [stakeChangeState, setStakeChangeState] = useState({}); // maintain a dirty state for stake changes (as opposed of sending it straight down to redux), else the betslip randomly refreshes

  // Refresh betslips
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (betslipData.model.outcomes.length > 0 && !stakeChangeState.typeId) {
        // do not refresh while the user is tinkering with the stakes
        onRefreshBetslipHandler(dispatch, location.pathname);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, betslipData.model.outcomes.length, stakeChangeState.typeId, location.pathname]);

  const stakeChangeHandler = (e, typeId) => {
    e.preventDefault();

    if (Number.isNaN(e.target.value)) {
      return;
    }

    // Track changes, but only submit when the onblur condition is over
    setStakeChangeState({ typeId, value: e.target.value });
  };

  const stakeChangeConfirm = () => {
    if (Object.keys(stakeChangeState).length > 0) {
      if (betTypeId === 1) {
        betslipData.betData.singles.forEach((x, index) => {
          onSpecificStakeChangeHandler(
            dispatch,
            location.pathname,
            betslipData,
            stakeChangeState.value,
            stakeChangeState.typeId,
            index,
          );
        });
      } else {
        // multiples
        onSpecificStakeChangeHandler(
          dispatch,
          location.pathname,
          betslipData,
          stakeChangeState.value,
          stakeChangeState.typeId,
          -1,
        );
      }

      if (betslipData.model.outcomes.length > 0) {
        onRefreshBetslipHandler(dispatch, location.pathname);
      }

      setStakeChangeState({}); // clear the dirty state for stake changes
    }
  };

  const stakeChangeConfirmedHandler = (e) => {
    e.preventDefault();

    stakeChangeConfirm();
  };

  const currentStake =
    stakeChangeState.typeId && stakeChangeState.typeId === betTypeId
      ? stakeChangeState.value
      : betTypeId === 1
      ? betslipData.betData.singles.find((x) => x.outcomeId)?.stake
      : betslipData.betData.multiples.find((x) => x.typeId === betTypeId)?.unitStake;

  const addDigit = (digit) => {
    setStakeChangeState({ typeId: betTypeId, value: Number(`${currentStake.toString()}${digit}`) });
  };
  const sumAmount = (amount) => {
    setStakeChangeState({ typeId: betTypeId, value: currentStake + amount });
  };
  const onClearStake = () => {
    setStakeChangeState({ typeId: betTypeId, value: 0 });
  };

  // A bit after a change in stake happens, do apply the change (do not wait for a blur event on desktop)
  useEffect(() => {
    const timeOutId = setTimeout(() => stakeChangeConfirm(), 250);

    return () => clearTimeout(timeOutId);
  }, [stakeChangeState]);

  const betTypeDescription =
    betTypeId === 1 ? "Singles" : betslipData.betData.multiples.find((x) => x.typeId === betTypeId)?.typeDescription;

  const allOutcomesValid = betslipData.model.outcomes.findIndex((outcome) => !outcome.valid) === -1;
  const hasOutcomes = betslipData.model.outcomes.length > 0;

  const onAcceptBetSubmission = () => {
    // if (cmsConfigBrandDetails.data?.singleWalletMode) {
    if (false) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname);
    } else {
      onSubmitBetslip(dispatch, location.pathname);
    }
  };

  return (
    <>
      <div className={classes["wrapper"]}>
        <Header />
        <div className={classes["main"]}>
          <div className={classes["main__container"]}>
            <div className={classes["betslip-page"]}>
              <div className={classes["betslip-page__title"]}>Bet Slip</div>
              <div className={classes["betslip-page__container"]}>
                <div className={cx(classes["betslip-page__doubles"], classes["betslip-page-doubles"])}>
                  <div className={classes["betslip-page-doubles__title"]}>
                    <span>{betTypeDescription || "N/A"}</span>
                  </div>
                  <div className={classes["betslip-page-doubles__top"]}>
                    <div className={classes["betslip-page-doubles__totals"]}>
                      <div className={classes["betslip-page-doubles__total"]}>Total Bet:</div>
                      <div className={classes["betslip-page-doubles__money"]}>
                        {`${getSymbolFromCurrency(currencyCode)} ${getGlobalTotalStake(betslipData).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          },
                        )}`}
                      </div>
                    </div>
                    <div className={classes["betslip-page-doubles__totals"]}>
                      <div className={classes["betslip-page-doubles__total"]}>Potential returns:</div>
                      <div className={classes["betslip-page-doubles__money"]}>
                        {dirtyPotentialWin
                          ? ""
                          : `${getSymbolFromCurrency(currencyCode)} ${getGlobalPotentialWin(betslipData).toLocaleString(
                              undefined,
                              {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                              },
                            )}`}
                      </div>
                    </div>
                    <div className={classes["betslip-page-doubles__notifications"]}>
                      <div className={classes["betslip-page-doubles__notification"]}>
                        Your bet does not qualify in any promotion
                      </div>
                      <div
                        className={cx(
                          classes["betslip-page-doubles__notification"],
                          classes["betslip-page-doubles__notification_special"],
                        )}
                      >
                        Click here to view the list of available promotions.
                      </div>
                    </div>
                  </div>
                  <div className={classes["betslip-page-doubles__body"]}>
                    {betslipData.model.outcomes.map((outcome, index) => (
                      <div
                        className={cx(classes["betslip-card"], { [classes["disabled"]]: !outcome.valid })}
                        key={index}
                      >
                        <div className={classes["betslip-card__header"]}>
                          <div
                            className={classes["betslip-card__cross"]}
                            onClick={() =>
                              onRemoveSelectionHandler(dispatch, location.pathname, outcome.outcomeId, false)
                            }
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </div>
                          <div className={classes["betslip-card__title"]}>{outcome.outcomeDescription}</div>
                          <div className={classes["betslip-card__coeficient"]}>{outcome.formattedPrice}</div>
                        </div>
                        <div className={classes["betslip-card__body"]}>
                          <div className={classes["betslip-card__match"]}>{outcome.eventDescription}</div>
                          <div className={classes["betslip-card__type"]}>
                            {`${outcome.marketDescription} - ${outcome.periodDescription}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={classes["betslip-page-betslip"]}>
                  <div className={classes["betslip-page-betslip__body"]}>
                    <div className={classes["betslip-page-betslip__input"]}>
                      <input
                        disabled={!allOutcomesValid || submitInProgress}
                        placeholder="0"
                        type="text"
                        value={currentStake > 0 ? currentStake : ""}
                        onBlur={stakeChangeConfirmedHandler}
                        onChange={(e) => stakeChangeHandler(e, betTypeId)}
                      />
                    </div>
                    <div className={classes["betslip-page-betslip__buttons"]}>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => addDigit(7)}>
                        7
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => addDigit(8)}>
                        8
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => addDigit(9)}>
                        9
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => addDigit(4)}>
                        4
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => addDigit(5)}>
                        5
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => addDigit(6)}>
                        6
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => addDigit(1)}>
                        1
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => addDigit(2)}>
                        2
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => addDigit(3)}>
                        3
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => addDigit(0)}>
                        0
                      </div>
                      <div className={cx(classes["betslip-page-betslip__button"], classes["hidden"])}>.</div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={onClearStake}>
                        C
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => sumAmount(5)}>
                        5
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => sumAmount(10)}>
                        10
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => sumAmount(25)}>
                        25
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => sumAmount(50)}>
                        50
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => sumAmount(100)}>
                        100
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => sumAmount(150)}>
                        150
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => sumAmount(200)}>
                        200
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => sumAmount(250)}>
                        250
                      </div>
                      <div className={classes["betslip-page-betslip__button"]} onClick={() => sumAmount(500)}>
                        500
                      </div>
                    </div>
                    <div className={classes["betslip-page-betslip__controls"]}>
                      <div className={classes["betslip-page-betslip__control"]} onClick={() => history.goBack()}>
                        Back
                      </div>
                      <div
                        className={cx(classes["betslip-page-betslip__control"], classes["popup-link"], {
                          [classes["disabled"]]:
                            !allOutcomesValid ||
                            !hasOutcomes ||
                            getGlobalTotalStake(betslipData) <= 0 ||
                            submitInProgress,
                        })}
                        disabled={
                          !allOutcomesValid || !hasOutcomes || getGlobalTotalStake(betslipData) <= 0 || submitInProgress
                        }
                        onClick={onAcceptBetSubmission}
                      >
                        Confirm
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {submitConfirmation && (
        <div className={cx(classes["popup-confirmation"], classes["popup"], classes["open"])}>
          <div className={classes["popup__body"]}>
            <div className={cx(classes["popup__content"], classes["popup-confirmation__content"])}>
              <div className={classes["popup-confirmation__header"]}>
                <h2 className={classes["popup-confirmation__title"]}>Success</h2>
              </div>
              <div className={classes["popup-confirmation__message"]}>
                <div className={classes["popup-confirmation__transaction"]}>
                  <svg
                    height="24"
                    version="1.1"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" />
                  </svg>
                  <span>Your bet has been successfully placed.</span>
                </div>
                {/* <div className={classes["popup-confirmation__reference"]}> */}
                {/*  <div className={classes["popup-confirmation__reference-title"]}>Reference :</div> */}
                {/*  <div className={classes["popup-confirmation__reference-result"]}>RE1-K1K</div> */}
                {/* </div> */}
                <div className={classes["popup-confirmation__label"]}>
                  You can keep your Previous Selections or place New Bets
                </div>
              </div>

              <div className={classes["popup-confirmation__buttons"]}>
                <div
                  className={cx(classes["popup-confirmation__button"], classes["close-popup"])}
                  onClick={() => {
                    acknowledgeSubmission(dispatch, location.pathname, false);
                    history.goBack();
                  }}
                >
                  Previous Selections
                </div>
                <div
                  className={classes["popup-confirmation__button"]}
                  onClick={() => {
                    acknowledgeSubmission(dispatch, location.pathname, true);
                    history.goBack();
                  }}
                >
                  New Bets
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {submitError && (
        <div className={cx(classes["popup-confirmation"], classes["popup"], classes["open"])}>
          <div className={classes["popup__body"]}>
            <div className={cx(classes["popup__content"], classes["popup-confirmation__content"])}>
              <div className={classes["popup-confirmation__header"]}>
                <h2 className={classes["popup-confirmation__title"]}>Error</h2>
              </div>
              <div className={classes["popup-confirmation__message"]}>
                <div className={classes["popup-confirmation__transaction"]}>
                  <svg
                    height="24"
                    version="1.1"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
                  </svg>
                  <span>{submitError}</span>
                </div>
              </div>

              <div className={classes["popup-confirmation__buttons"]}>
                <div
                  className={cx(classes["popup-confirmation__button"], classes["close-popup"])}
                  onClick={() => {
                    acknowledgeErrors(dispatch, location.pathname);
                  }}
                >
                  OK
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(BetslipPage);
