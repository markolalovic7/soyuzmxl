import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { FormatOptions, numToKorean } from "num-to-korean";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getAuthLoggedIn } from "../../../../../redux/reselect/auth-selector";
import { getBalance } from "../../../../../redux/reselect/balance-selector";
import {
  makeGetBetslipData,
  makeGetBetslipModelUpdateInProgress,
} from "../../../../../redux/reselect/betslip-selector";
import { obtainMaxStake } from "../../../../../redux/slices/betslipSlice";
import { saveSettings } from "../../../../../redux/slices/ezSettingsSlice";
import {
  getSingleStake,
  onRefreshBetslipHandler,
  onSpecificStakeChangeHandler,
} from "../../../../../utils/betslip-utils";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const defaultProps = {
  outcomeId: undefined,
};

const propTypes = {
  onClose: PropTypes.func.isRequired,
  outcomeId: PropTypes.number,
  typeId: PropTypes.number.isRequired,
  warningShown: PropTypes.bool.isRequired,
};

const MIN_STAKE = 10000;
const MAX_STAKE = 10000000;

function isNaN(value) {
  // Refer http://www.ecma-international.org/ecma-262/6.0/#sec-isnan-number
  // section's NOTE.
  return Number(value) !== value;
}

const DesktopStakePanel = ({ onClose, outcomeId, typeId, warningShown }) => {
  //     TODO onclose, discard state?
  const dispatch = useDispatch();

  const location = useLocation();
  const { t } = useTranslation();
  const balance = useSelector(getBalance);

  const [tempStake, setTempStake] = useState(undefined);
  const [stakeIsValid, setStakeIsValid] = useState(false);
  const [isEditingMoneyButtons, setIsEditingMoneyButtons] = useState(false);
  const [areMoneyButtonValuesValid, setAreMoneyButtonValuesValid] = useState(false);
  const [areMoneyButtonValuesDirty, setAreMoneyButtonValuesDirty] = useState(false);
  const [activeEditedMoneyButton, setActiveEditedMoneyButton] = useState(undefined);

  const [maxStakeIsLoading, setMaxStakeIsLoading] = useState(false);

  const autoApprovalMode = useSelector((state) => state.ez.autoApprovalMode); // AUTO_ALL, AUTO_HIGHER, MANUAL
  const moneyButtons = useSelector((state) => [state.ez.moneyButton1, state.ez.moneyButton2, state.ez.moneyButton3]);
  const [dirtyMoneyButtons, setDirtyMoneyButtons] = useState(moneyButtons);

  const isLoggedIn = useSelector(getAuthLoggedIn);

  const [stakeCursorTimestamp, setStakeCursorTimestamp] = useState(Date.now());
  const [stakeCursor, setStakeCursor] = useState(null);
  const cursorRef = useRef(null); // track the cursor position in the input stake field

  const [moneyButtonCursorTimestamp, setMoneyButtonCursorTimestamp] = useState({
    1: Date.now(),
    2: Date.now(),
    3: Date.now(),
  });
  const [moneyButtonCursor, setMoneyButtonCursor] = useState({ 1: null, 2: null, 3: null });
  const moneyButtonCursorRef = [useRef(null), useRef(null), useRef(null)];

  const getBetslipData = useMemo(makeGetBetslipData, []);
  const betslipData = useSelector((state) => getBetslipData(state, location.pathname));

  const getBetslipModelUpdateInProgress = useMemo(makeGetBetslipModelUpdateInProgress, []);
  const modelUpdateInProgress = useSelector((state) => getBetslipModelUpdateInProgress(state, location.pathname));

  const outcomeIndex = useMemo(
    () => betslipData.model.outcomes.findIndex((o) => o.outcomeId === outcomeId),
    [betslipData, outcomeId],
  );

  const currentStake = useMemo(() => {
    // TODO - discard this if we want to change right away?

    if (tempStake !== undefined) return tempStake;

    const currentStake =
      typeId === 1
        ? getSingleStake(betslipData, outcomeId)
        : betslipData.betData.multiples.find((m) => m.typeId === typeId)?.unitStake || 0;

    return currentStake;
  }, [betslipData, tempStake, typeId, outcomeId, outcomeIndex]);

  useEffect(() => {
    if ((currentStake >= MIN_STAKE || currentStake === 0) && currentStake <= MAX_STAKE) {
      setStakeIsValid(true);
    } else {
      setStakeIsValid(false);
    }
  }, [currentStake, isEditingMoneyButtons]);

  useEffect(() => {
    const input = cursorRef.current;
    if (input) input.setSelectionRange(stakeCursor, stakeCursor);
  }, [cursorRef, stakeCursor, stakeCursorTimestamp]);

  useEffect(() => {
    moneyButtonCursorRef.forEach((ref, index) => {
      const input = ref.current;
      if (input) input.setSelectionRange(moneyButtonCursor[index + 1], moneyButtonCursor[index + 1]);
    });
  }, [moneyButtonCursor, moneyButtonCursorTimestamp]); // we exclude moneyButtonCursorRef on purpose

  useEffect(() => {
    if (
      dirtyMoneyButtons[0] >= MIN_STAKE &&
      dirtyMoneyButtons[0] <= MAX_STAKE &&
      dirtyMoneyButtons[1] >= MIN_STAKE &&
      dirtyMoneyButtons[1] <= MAX_STAKE &&
      dirtyMoneyButtons[2] >= MIN_STAKE &&
      dirtyMoneyButtons[2] <= MAX_STAKE &&
      [...new Set(dirtyMoneyButtons)].length === 3
    ) {
      setAreMoneyButtonValuesValid(true);
    } else {
      setAreMoneyButtonValuesValid(false);
    }
  }, [dirtyMoneyButtons]);

  const {
    areEditedMoneyButtonsInvalid,
    areEditedMoneyButtonsValid,
    isEditButtonConfirmWarning,
    isEditButtonFormatDuplicateError,
    isEditButtonFormatError,
    isEditButtonMinAmountWarning,
    isMaxStakeValidationError,
    isMinStakeValidationError,
    isMoneyButtonValueAboveMinError,
    isMoneyButtonValueUnderMaxError,
    isTopUpMessage,
  } = useMemo(
    () => ({
      areEditedMoneyButtonsInvalid: isEditingMoneyButtons && !(areMoneyButtonValuesValid && areMoneyButtonValuesDirty),
      areEditedMoneyButtonsValid: isEditingMoneyButtons && areMoneyButtonValuesValid && areMoneyButtonValuesDirty,
      isEditButtonConfirmWarning:
        isEditingMoneyButtons && activeEditedMoneyButton !== undefined && areMoneyButtonValuesValid,
      isEditButtonFormatDuplicateError: isEditingMoneyButtons && [...new Set(dirtyMoneyButtons)].length < 3,
      isEditButtonFormatError:
        isEditingMoneyButtons && !areMoneyButtonValuesValid && [...new Set(dirtyMoneyButtons)].length === 3,
      isEditButtonMinAmountWarning:
        isEditingMoneyButtons && activeEditedMoneyButton === undefined && areMoneyButtonValuesValid,
      isMaxStakeValidationError:
        !isEditingMoneyButtons &&
        (!balance?.availableBalance || currentStake <= balance?.availableBalance) &&
        currentStake > MAX_STAKE,
      isMinStakeValidationError: !isEditingMoneyButtons && currentStake > 0 && currentStake < MIN_STAKE,
      isMoneyButtonValueAboveMinError:
        activeEditedMoneyButton !== undefined && dirtyMoneyButtons[activeEditedMoneyButton] < MIN_STAKE,
      isMoneyButtonValueUnderMaxError:
        activeEditedMoneyButton !== undefined && dirtyMoneyButtons[activeEditedMoneyButton] > MAX_STAKE,
      isTopUpMessage: !isEditingMoneyButtons && isLoggedIn && currentStake > balance?.availableBalance,
    }),
    [
      activeEditedMoneyButton,
      isEditingMoneyButtons,
      areMoneyButtonValuesValid,
      areMoneyButtonValuesDirty,
      dirtyMoneyButtons,
      currentStake,
      balance,
    ],
  );

  const onAddAmount = (amount) => {
    // this digit refers to a stake change
    const newStake = currentStake + amount;
    setTempStake(newStake);
  };

  const onAddDigit = (digit) => {
    // setStakeChangeState({ index: outcomeIndex, typeId, value: newStake });

    if (isEditingMoneyButtons) {
      if (activeEditedMoneyButton === undefined) {
        return;
      }

      const moneyButtonStake = dirtyMoneyButtons[activeEditedMoneyButton];
      const newStake = Number(`${moneyButtonStake.toString() + digit}`);

      const tempDirtyMoneyButtons = [...dirtyMoneyButtons];

      tempDirtyMoneyButtons[activeEditedMoneyButton] = newStake;
      setDirtyMoneyButtons(tempDirtyMoneyButtons);

      setAreMoneyButtonValuesDirty(true);
    } else {
      // this digit refers to a stake change
      const newStake = Number(`${currentStake.toString() + digit}`);
      setTempStake(newStake);
    }
  };

  const onChangeDirtyMoneyButton = (value) => {
    if (activeEditedMoneyButton === undefined) {
      return;
    }

    const newStake = Number(Math.round(value)); // avoid decimals

    const tempDirtyMoneyButtons = [...dirtyMoneyButtons];

    tempDirtyMoneyButtons[activeEditedMoneyButton] = newStake;
    setDirtyMoneyButtons(tempDirtyMoneyButtons);

    setAreMoneyButtonValuesDirty(true);
  };

  const onRemoveDigit = () => {
    if (isEditingMoneyButtons) {
      if (activeEditedMoneyButton === undefined) {
        return;
      }

      const moneyButtonStake = dirtyMoneyButtons[activeEditedMoneyButton];
      if (moneyButtonStake.toString().length > 1) {
        const newStake = Number(`${moneyButtonStake.toString().slice(0, moneyButtonStake.toString().length - 1)}`);
        const tempDirtyMoneyButtons = [...dirtyMoneyButtons];

        tempDirtyMoneyButtons[activeEditedMoneyButton] = newStake;
        setDirtyMoneyButtons(tempDirtyMoneyButtons);
      } else {
        // setStakeChangeState({ index: outcomeIndex, typeId, value: 0 });
        const tempDirtyMoneyButtons = [...dirtyMoneyButtons];

        tempDirtyMoneyButtons[activeEditedMoneyButton] = 0;
        setDirtyMoneyButtons(tempDirtyMoneyButtons);
      }

      setAreMoneyButtonValuesDirty(true);
    } else if (currentStake.toString().length > 1) {
      const newStake = Number(`${currentStake.toString().slice(0, currentStake.toString().length - 1)}`);
      // setStakeChangeState({ index: outcomeIndex, typeId, value: newStake });
      setTempStake(newStake);
    } else {
      // setStakeChangeState({ index: outcomeIndex, typeId, value: 0 });
      setTempStake(0);
    }
  };

  const onSave = () => {
    if (typeId === 1) {
      if (outcomeId) {
        onSpecificStakeChangeHandler(dispatch, location.pathname, betslipData, currentStake, typeId, outcomeIndex);
      } else {
        betslipData.model.outcomes.forEach((x, outcomeIndex) =>
          onSpecificStakeChangeHandler(dispatch, location.pathname, betslipData, currentStake, typeId, outcomeIndex),
        );
      }
    } else {
      onSpecificStakeChangeHandler(dispatch, location.pathname, betslipData, currentStake, typeId, outcomeIndex);
    }

    onRefreshBetslipHandler(dispatch, location.pathname);

    onClose();
  };

  const saveMoneyButtons = () => {
    const sortedDirtyMoneyButtons = dirtyMoneyButtons.sort((a, b) => a - b);
    setDirtyMoneyButtons(sortedDirtyMoneyButtons);

    dispatch(
      saveSettings({
        autoApprovalMode,
        moneyButton1: sortedDirtyMoneyButtons[0],
        moneyButton2: sortedDirtyMoneyButtons[1],
        moneyButton3: sortedDirtyMoneyButtons[2],
      }),
    );
  };

  const onLoadMaxStake = () => {
    const fetchMaxStake = async () => {
      setMaxStakeIsLoading(true);

      const action = await dispatch(obtainMaxStake({ factor: 1, outcomeId, typeId }));
      if (obtainMaxStake.fulfilled.match(action)) {
        const computedMaxStake = Math.round(
          Math.min(balance?.availableBalance ?? 0, action.payload.maxStake, MAX_STAKE),
        );
        setTempStake(computedMaxStake);
      }
      setMaxStakeIsLoading(false);
    };

    fetchMaxStake();
  };

  const onConfirmMoneyButtonEdit = () => {
    saveMoneyButtons();
    setAreMoneyButtonValuesValid(true);
    setAreMoneyButtonValuesDirty(false);
    setActiveEditedMoneyButton(undefined);
    setIsEditingMoneyButtons(false);
  };

  const onEditAmountKeyDownHandler = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
    if (e.key === "Enter" && areEditedMoneyButtonsValid) {
      onConfirmMoneyButtonEdit();
    }
  };

  return (
    <div className={classes["numeric-keyboard"]} style={{ display: "auto" }} onClick={onClose}>
      <div className={classes["numeric-keyboard-inner"]} onClick={(e) => e.stopPropagation()}>
        <div className={cx(classes["keyboard-header"], classes["relative"])}>
          <button className={cx(classes["link"], classes["absolute"])} type="button" onClick={onClose}>
            <i className={classes["icon-close"]} />
          </button>
          {!isEditingMoneyButtons ? (
            balance?.availableBalance && (
              <p>{`${t("ez.balance")}: ${Math.floor(Number(balance.availableBalance)).toLocaleString()} KRW`}</p>
            )
          ) : (
            <p>키패드 편집 기능:</p>
          )}
          <div className={classes["flex-al-center"]}>
            {!isEditingMoneyButtons ? (
              <p>
                {`${t("ez.potential_win")} ${
                  modelUpdateInProgress
                    ? ""
                    : typeId === 1
                    ? Math.floor(
                        outcomeId
                          ? betslipData.model.outcomes.find((m) => m.outcomeId === outcomeId)?.price * currentStake
                          : betslipData.model.outcomes.filter((x) => x.enabled).reduce((a, { price }) => a + price, 0) *
                              currentStake,
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      })
                    : Math.floor(
                        Number(betslipData.betData.multiples.find((m) => m.typeId === typeId)?.price) *
                          Number(currentStake),
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      })
                } KRW`}
              </p>
            ) : (
              <p>자주 이용하는 금액을 설정 할 수 있습니다.</p>
            )}
            {!isEditingMoneyButtons && (
              <p>{`${t("ez.bet_type")}: ${
                typeId === 1
                  ? betslipData.model.outcomes.length <= 1
                    ? t("ez.single")
                    : t("ez.multisingle")
                  : t("ez.multiple")
              }`}</p>
            )}
          </div>
          {!isEditingMoneyButtons ? (
            <p>
              {`${t("ez.odds")}: ${
                typeId === 1
                  ? outcomeId
                    ? betslipData.model.outcomes.find((m) => m.outcomeId === outcomeId)?.price
                    : betslipData.model.outcomes
                        .filter((x) => x.enabled)
                        .reduce((a, { price }) => a + price, 0)
                        .toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })
                  : modelUpdateInProgress
                  ? ""
                  : parseFloat(betslipData.betData.multiples.find((m) => m.typeId === typeId)?.price || 0)
                      .toFixed(2)
                      .toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })
              }`}
            </p>
          ) : (
            <p>변경 내용을 취소하려면 X를 누릅니다.</p>
          )}
        </div>
        <div className={classes["keyboard-body"]}>
          <div className={cx(classes["top-inputs-and-buttons-primary"], classes["flex-al-center"])}>
            <div className={classes["relative"]}>
              <input
                disabled={isEditingMoneyButtons}
                maxLength={15}
                pattern="\d+(?:[.,]\d+)?"
                placeholder="0"
                ref={cursorRef}
                style={{
                  color: isEditingMoneyButtons ? "#adadad" : "#242424",
                  paddingRight: currentStake > 0 ? "45px" : "15px",
                }}
                type="text"
                value={currentStake ? currentStake.toLocaleString() : ""}
                onChange={(e) => {
                  let selectionStart = e.target.selectionStart - 1; // revert the cursor change unless there is a valid change

                  const value = e.target.value.replace(/,/g, "").replace(/[e,E]/g, "");

                  //  validate we do have a number...
                  if (!isNaN(Number(value)) && value.toString().length <= 12) {
                    if (Math.round(value) !== currentStake) {
                      // maintain the cursor position with lots of trickery...
                      let selectionStartCorrection = 0;
                      if (tempStake && Math.round(value).toString().length > tempStake.toString().length) {
                        // add one value if there is an extra comma
                        selectionStartCorrection = Math.round(value).toString().length % 3 === 1 ? 1 : 0;
                      } else if (tempStake && Math.round(value).toString().length < tempStake.toString().length) {
                        // add one value if we lost a comma
                        selectionStartCorrection = Math.round(value).toString().length % 3 === 0 ? -1 : 0;
                      }

                      selectionStart = e.target.selectionStart + selectionStartCorrection; // factor if we will have another comma added in
                      setStakeCursor(selectionStart);

                      setTempStake(Math.round(value));
                    }
                  }

                  setStakeCursor(selectionStart);
                  setStakeCursorTimestamp(Date.now());
                }}
                // value={currentStake.toLocaleString()}
              />
              {currentStake > 0 && (
                <span
                  className={cx(classes["icon-grey-close"], classes["absolute"])}
                  onClick={() => !isEditingMoneyButtons && setTempStake(0)}
                />
              )}
              {currentStake >= 1000 && (
                <small className={classes["absolute"]}>{numToKorean(currentStake, FormatOptions.MIXED)}</small>
              )}
            </div>
            <button
              className={cx(classes["primary"], classes["max-btn"])}
              disabled={!isLoggedIn || isEditingMoneyButtons || maxStakeIsLoading}
              type="button"
              onClick={() => onLoadMaxStake()}
            >
              {maxStakeIsLoading ? (
                <FontAwesomeIcon
                  className="fa-spin"
                  icon={faSpinner}
                  style={{ "--fa-primary-color": "white", "--fa-secondary-color": "#E6E6E6" }}
                />
              ) : (
                `MAX`
              )}
            </button>
            <button
              className={cx(
                { [classes["primary"]]: stakeIsValid },
                { [classes["grey"]]: !stakeIsValid },
                classes["confirmation-button"],
              )}
              disabled={isEditingMoneyButtons || !stakeIsValid || isTopUpMessage}
              type="button"
              onClick={onSave}
            >
              {t("confirm")}
            </button>
          </div>
          <div className={cx(classes["top-inputs-and-buttons-secondary"], classes["flex-al-center"])}>
            {dirtyMoneyButtons.map((moneyButtonValue, index) => {
              if (activeEditedMoneyButton !== index) {
                return (
                  <button
                    className={cx(
                      { [classes["outline"]]: activeEditedMoneyButton !== index },
                      { [classes["active-border-and-value"]]: activeEditedMoneyButton === index },
                    )}
                    key={index}
                    style={{ fontSize: "12px" }}
                    type="button"
                    onClick={() => {
                      if (isEditingMoneyButtons) {
                        setActiveEditedMoneyButton(index);
                      } else {
                        onAddAmount(moneyButtonValue);
                      }
                    }}
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                  >
                    {moneyButtonValue.toLocaleString()}
                  </button>
                );
              }

              return (
                <input
                  className={cx({ [classes["active-border-and-value"]]: true })}
                  key={index}
                  maxLength={15}
                  pattern="\d+(?:[.,]\d+)?"
                  ref={moneyButtonCursorRef[index]}
                  style={{ fontSize: "12px" }}
                  type="text"
                  value={moneyButtonValue.toLocaleString()}
                  onChange={(e) => {
                    let selectionStart = e.target.selectionStart - 1; // revert the cursor change unless there is a valid change

                    const value = e.target.value.replace(/,/g, "").replace(/[e,E]/g, "");

                    //  validate we do have a number...
                    if (!isNaN(Number(value)) && value.toString().length <= 12) {
                      if (Math.round(value) !== moneyButtonValue) {
                        // maintain the cursor position with lots of trickery...
                        let selectionStartCorrection = 0;
                        if (
                          moneyButtonValue &&
                          Math.round(value).toString().length > moneyButtonValue.toString().length
                        ) {
                          // add one value if there is an extra comma
                          selectionStartCorrection = Math.round(value).toString().length % 3 === 1 ? 1 : 0;
                        } else if (
                          moneyButtonValue &&
                          Math.round(value).toString().length < moneyButtonValue.toString().length
                        ) {
                          // add one value if we lost a comma
                          selectionStartCorrection = Math.round(value).toString().length % 3 === 0 ? -1 : 0;
                        }

                        selectionStart = e.target.selectionStart + selectionStartCorrection; // factor if we will have another comma added in
                        setMoneyButtonCursor({ ...moneyButtonCursor, [index + 1]: selectionStart });

                        onChangeDirtyMoneyButton(value.replace(/,/g, ""));
                      }
                    }

                    setMoneyButtonCursor({ ...moneyButtonCursor, [index + 1]: selectionStart });
                    setMoneyButtonCursorTimestamp({ ...moneyButtonCursorTimestamp, [index + 1]: Date.now() });
                  }}
                  onKeyDown={onEditAmountKeyDownHandler}
                />
              );
            })}

            {!isEditingMoneyButtons && (
              <button
                className={cx(classes["outline"], classes["edit-clean-button"])}
                disabled={!isLoggedIn}
                style={{ maxWidth: "60px" }}
                type="button"
                onClick={() => setIsEditingMoneyButtons(true)}
              >
                <i className={cx(classes["key-icon"], classes["icon-edit"])} />
              </button>
            )}
            {areEditedMoneyButtonsInvalid && (
              <button
                className={cx(classes["primary"], classes["edit-clean-button"])}
                style={{ maxWidth: "60px" }}
                type="button"
                onClick={() => {
                  setAreMoneyButtonValuesValid(true);
                  setAreMoneyButtonValuesDirty(false);
                  setActiveEditedMoneyButton(undefined);
                  setIsEditingMoneyButtons(false);
                  setDirtyMoneyButtons(moneyButtons);
                }}
              >
                <i className={cx(classes["key-icon"], classes["icon-close"])} />
              </button>
            )}
            {areEditedMoneyButtonsValid && (
              <button
                className={cx(classes["primary"], classes["edit-clean-button"])}
                style={{ maxWidth: "60px" }}
                type="button"
                onClick={onConfirmMoneyButtonEdit}
              >
                <i className={cx(classes["key-icon"], classes["icon-white-check"])} />
              </button>
            )}
          </div>
          {isMinStakeValidationError && (
            <p className={cx(classes["flex-al-center"], classes["red-alert"], classes["red-alert1"])}>
              <i className={cx(classes["key-icon"], classes["icon-red-alert-circle"])} />
              {t("ez.betslip_min_stake_error")}
            </p>
          )}
          {isMaxStakeValidationError && (
            <p className={cx(classes["flex-al-center"], classes["red-alert"], classes["red-alert1"])}>
              <i className={cx(classes["key-icon"], classes["icon-red-alert-circle"])} />
              {t("ez.betslip_max_stake_error")}
            </p>
          )}

          {isTopUpMessage && (
            <p className={cx(classes["flex-al-center"], classes["red-alert"], classes["red-alert1"])}>
              <i className={cx(classes["key-icon"], classes["icon-red-alert-circle"])} />
              {t("ez.insufficient_balance")}
              <span style={{ color: "#00acee" }}>
                &nbsp;
                {t("ez.top_up_balance")}
              </span>
            </p>
          )}

          {!isEditingMoneyButtons && !isTopUpMessage && !isMinStakeValidationError && !isMaxStakeValidationError && (
            <p className={classes["flex-al-center"]}>
              <i className={cx(classes["key-icon"], classes["icon-edit"])} />
              {t("ez.betslip_edit_money_buttons")}
            </p>
          )}
          {activeEditedMoneyButton !== undefined && isEditButtonMinAmountWarning && (
            <p className={cx(classes["flex-al-center"], classes["blue-check"], classes["blue-check1"])}>
              <i className={cx(classes["key-icon"], classes["icon-blue-check"])} />
              {t("ez.betslip_min_amount_warning")}
            </p>
          )}
          {isEditButtonConfirmWarning && (
            <p className={cx(classes["flex-al-center"], classes["blue-check"], classes["blue-check2"])}>
              <i className={cx(classes["key-icon"], classes["icon-blue-check"])} />
              {t("ez.betslip_confirm_money_button_change")}
            </p>
          )}
          {isEditButtonFormatError && !isMoneyButtonValueAboveMinError && !isMoneyButtonValueUnderMaxError && (
            <p className={cx(classes["flex-al-center"], classes["red-alert"], classes["red-alert1"])}>
              <i className={cx(classes["key-icon"], classes["icon-red-alert-circle"])} />
              {t("ez.betslip_money_button_error")}
            </p>
          )}
          {isEditButtonFormatError && isMoneyButtonValueAboveMinError && (
            <p className={cx(classes["flex-al-center"], classes["red-alert"], classes["red-alert1"])}>
              <i className={cx(classes["key-icon"], classes["icon-red-alert-circle"])} />
              {t("ez.betslip_min_amount_error")}
            </p>
          )}
          {isEditButtonFormatError && isMoneyButtonValueUnderMaxError && (
            <p className={cx(classes["flex-al-center"], classes["red-alert"], classes["red-alert1"])}>
              <i className={cx(classes["key-icon"], classes["icon-red-alert-circle"])} />
              {t("ez.betslip_max_amount_error")}
            </p>
          )}
          {isEditButtonFormatDuplicateError && (
            <p className={cx(classes["flex-al-center"], classes["red-alert"], classes["red-alert2"])}>
              <i className={cx(classes["key-icon"], classes["icon-red-alert-circle"])} />
              {t("ez.betslip_money_button_duplicated_amount_error")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

DesktopStakePanel.propTypes = propTypes;
DesktopStakePanel.defaultProps = defaultProps;

export default React.memo(DesktopStakePanel);
