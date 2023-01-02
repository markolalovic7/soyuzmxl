import { faArrowLeft, faClipboardList, faTimes, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";

import {
  makeGetBetslipData,
  makeGetBetslipSubmitConfirmation,
  makeGetBetslipSubmitError,
  makeGetBetslipSubmitInProgress,
} from "../../../../../redux/reselect/betslip-selector";
import {
  getRetailSelectedPlayerAccountData,
  getRetailSelectedPlayerAccountId,
  getRetailTillDetails,
} from "../../../../../redux/reselect/retail-selector";
import {
  acknowledgeErrors,
  acknowledgeSubmission,
  getGlobalPotentialWin,
  getGlobalTotalStake,
  onRefreshBetslipHandler,
  onSpecificStakeChangeHandler,
  onSubmitBetslip,
  onSubmitSingleWalletBetslip,
} from "../../../../../utils/betslip-utils";
import Footer from "../../../components/Footer/components";
import SlipstreamPopup from "../../../components/SlipstreamPopup/SlipstreamPopup";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import withNfcRedirection from "../../../hocs/withNfcRedirection";
import LogoPNG from "../../../img/logo.png";
import { printBetslip } from "../../../utils/printer";

const BetslipPage = () => {
  const { betTypeId: betTypeIdStr } = useParams();
  const betTypeId = Number(betTypeIdStr);

  const [successPopUp, setSuccessPopUp] = useState(false);
  const [errorPopUp, setErrorPopUp] = useState(false);

  const selectedPlayerId = useSelector(getRetailSelectedPlayerAccountId);
  const selectedPlayerAccountData = useSelector(getRetailSelectedPlayerAccountData);

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

  const savedBetslipReference = useSelector((state) => state.betslip.savedBetslipReference);

  const dirtyPotentialWin = useSelector((state) => state.betslip.dirtyPotentialWin);
  const tillDetails = useSelector(getRetailTillDetails);
  const currencyCode = tillDetails?.currencyCode;

  const [stakeChangeState, setStakeChangeState] = useState({}); // maintain a dirty state for stake changes (as opposed of sending it straight down to redux), else the betslip randomly refreshes
  const [isBalanceBet, setIsBalanceBet] = useState(true);

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

  const sendBetslipToPrinter = useCallback(
    (betslipData, savedBetslipReference) => {
      const brandName = "Demobet";
      const jackpotData = {};
      const shopAddress = "Registered Address";
      printBetslip(
        brandName,
        `${selectedPlayerAccountData?.firstName} - ${selectedPlayerAccountData?.lastName}`,
        selectedPlayerAccountData?.username,
        currencyCode,
        false,
        betslipData.betData.multiples.findIndex((x) => x.unitStake > 0) > -1,
        betslipData.betData.singles.findIndex((x) => x.stake > 0) > -1,
        jackpotData,
        shopAddress,
        tillDetails?.shopDescription,
        tillDetails?.tillDescription,
        betslipData.model.outcomes,
        betslipData.betData.singles,
        betslipData.betData.multiples,
        getGlobalTotalStake(betslipData),
        savedBetslipReference,
      );
    },
    [selectedPlayerAccountData, tillDetails],
  );

  const onAcceptBetSubmission = () => {
    // if (cmsConfigBrandDetails.data?.singleWalletMode) {
    if (false) {
      onSubmitSingleWalletBetslip(dispatch, location.pathname, !isBalanceBet);
    } else {
      onSubmitBetslip(dispatch, location.pathname, !isBalanceBet);
    }
  };

  useEffect(() => {
    if (submitConfirmation) {
      sendBetslipToPrinter(betslipData, savedBetslipReference);
      setSuccessPopUp(true);
    }
  }, [submitConfirmation]);

  useEffect(() => {
    if (submitError) {
      setErrorPopUp(true);
    }
  }, [submitError]);

  useEffect(() => {
    if (!selectedPlayerId) {
      history.push("/");
    }
  }, [selectedPlayerId]);

  return (
    <div className={classes["slipstream-body"]}>
      <div className={classes["wrapper"]}>
        <header className={classes["header"]}>
          <div className={classes["header__container"]}>
            <div className={classes["header__logo"]} onClick={() => history.push("/")}>
              <img alt="" src={LogoPNG} />
            </div>

            <div className={classes["header__links"]}>
              <div className={cx(classes["header__link"], classes["link"])} onClick={() => history.goBack()}>
                <span className={classes["link__icon"]}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </span>
                <span className={classes["link__text"]}>Back</span>
              </div>
            </div>
          </div>
        </header>
        <div className={classes["main"]}>
          <div className={classes["main__container"]}>
            <div className={classes["betslip-page"]}>
              <div className={cx(classes["betslip-page__doubles"], classes["betslip-page-doubles"])}>
                <div className={classes["betslip-page-doubles__title"]}>
                  <span>{betTypeDescription || "N/A"}</span>
                  <span>{`[${selectedPlayerAccountData?.username} - ${selectedPlayerAccountData?.firstName} ${selectedPlayerAccountData?.lastName}]`}</span>
                </div>
                {/* <div className={classes["betslip-page-doubles__notification"]}> */}
                {/*  <div className={classes["betslip-page-doubles__text"]}> */}
                {/*    The bet has been successfully placed for JCTEST33 - Catalan, Jc - 34 */}
                {/*  </div> */}
                {/* </div> */}
                <div className={classes["betslip-page-doubles__body"]}>
                  {betslipData.model.outcomes.map((outcome, index) => (
                    <div className={cx(classes["betslip-card"], { [classes["disabled"]]: !outcome.valid })} key={index}>
                      <div className={classes["betslip-card__header"]}>
                        <div className={classes["betslip-card__title"]}>{outcome.outcomeDescription}</div>
                        <div className={classes["betslip-card__coeficient"]}>{outcome.formattedPrice}</div>
                      </div>
                      <div className={classes["betslip-card__body"]}>
                        <div className={classes["betslip-card__match"]}>{outcome.eventDescription}</div>
                        <div className={classes["betslip-card__outcome"]}>
                          {`${outcome.marketDescription} - ${outcome.periodDescription}`}
                        </div>
                        {/* <div className={classes["betslip-card__label"]}>Win only</div> */}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={classes["betslip-page-doubles__bottom"]}>
                  <div className={classes["betslip-page-doubles__totals"]}>
                    <div className={classes["betslip-page-doubles__total"]}>Total Investment:</div>
                    <div className={classes["betslip-page-doubles__money"]}>
                      {" "}
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
                    <div className={classes["betslip-page-doubles__total"]}>Potential Returns:</div>
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
                  {/* <div className={classes["betslip-page-doubles__ticket-number"]}>Ticket number: RF1-K1K</div> */}
                </div>
              </div>
              <div className={cx(classes["betslip-page-betslip"], classes["betslip"])}>
                <div className={classes["betslip__title"]}>
                  <div className={classes["betslip__icon"]}>
                    <FontAwesomeIcon icon={faClipboardList} />
                  </div>
                  <div className={classes["betslip__text"]}>Betslip</div>
                  <div className={classes["betslip__close"]}>
                    <FontAwesomeIcon icon={faTimes} />
                  </div>
                </div>
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
                      Previous Selections
                    </div>
                    <div
                      className={cx(
                        classes["betslip-page-betslip__control"],
                        classes["betslip-page-betslip__control_error"],
                        {
                          [classes["disabled"]]:
                            !allOutcomesValid ||
                            !hasOutcomes ||
                            getGlobalTotalStake(betslipData) <= 0 ||
                            submitInProgress,
                        },
                      )}
                      disabled={
                        !allOutcomesValid || !hasOutcomes || getGlobalTotalStake(betslipData) <= 0 || submitInProgress
                      }
                      onClick={onAcceptBetSubmission}
                    >
                      Confirm Bet
                    </div>
                    <div
                      className={classes["betslip-page-betslip__error"]}
                      style={{ background: isBalanceBet ? "#ff243d" : "green" }}
                    >
                      <span />
                      <span>{`You are placing a ${isBalanceBet ? "BALANCE" : "CASH"} bet`}</span>
                      <span onClick={() => setIsBalanceBet((prevState) => !prevState)}>
                        <FontAwesomeIcon icon={isBalanceBet ? faToggleOn : faToggleOff} size="6x" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {successPopUp && (
        <SlipstreamPopup
          headerText="Success"
          text="Your bet has been placed!"
          onClose={() => {
            setSuccessPopUp(false);
            acknowledgeSubmission(dispatch, location.pathname, true);
            onRefreshBetslipHandler(dispatch, location.pathname);
            history.push("/");
          }}
        />
      )}
      {errorPopUp && (
        <SlipstreamPopup
          headerText="Error"
          text={submitError}
          onClose={() => {
            setErrorPopUp(false);
            acknowledgeErrors(dispatch, location.pathname);
          }}
        />
      )}
    </div>
  );
};

export default withNfcRedirection(withBarcodeReader(BetslipPage));
