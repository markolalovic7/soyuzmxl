import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { FormatOptions, numToKorean } from "num-to-korean";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getAuthLoggedIn } from "../../../../../../../redux/reselect/auth-selector";
import { getBalance } from "../../../../../../../redux/reselect/balance-selector";
import {
  makeGetBetslipData,
  makeGetBetslipModelUpdateInProgress,
} from "../../../../../../../redux/reselect/betslip-selector";
import { obtainMaxStake } from "../../../../../../../redux/slices/betslipSlice";
import { saveSettings } from "../../../../../../../redux/slices/ezSettingsSlice";
import {
  getSingleStake,
  onRefreshBetslipHandler,
  onSpecificStakeChangeHandler,
} from "../../../../../../../utils/betslip-utils";
import classes from "../../../../../scss/ezbet.module.scss";

const defaultProps = {
  outcomeId: undefined,
};

const propTypes = {
  onClose: PropTypes.func.isRequired,
  outcomeId: PropTypes.number,
  typeId: PropTypes.number.isRequired,
};

const MIN_STAKE = 10000;
const MAX_STAKE = 10000000;

const MobileStakePanel = ({ onClose, outcomeId, typeId }) => {
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
        : betslipData.betData.multiples.find((m) => m.typeId === typeId)?.unitStake ?? 0;

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

    if (newStake.toString().length <= 12) setTempStake(newStake);
  };

  const onAddDigit = (digit) => {
    // setStakeChangeState({ index: outcomeIndex, typeId, value: newStake });

    if (isEditingMoneyButtons) {
      if (activeEditedMoneyButton === undefined) {
        return;
      }

      const moneyButtonStake = dirtyMoneyButtons[activeEditedMoneyButton];
      const newStake = Number(`${moneyButtonStake.toString() + digit}`);

      if (newStake.toString().length <= 12) {
        const tempDirtyMoneyButtons = [...dirtyMoneyButtons];

        tempDirtyMoneyButtons[activeEditedMoneyButton] = newStake;
        setDirtyMoneyButtons(tempDirtyMoneyButtons);

        setAreMoneyButtonValuesDirty(true);
      }
    } else {
      // this digit refers to a stake change
      const newStake = Number(`${currentStake.toString() + digit}`);
      if (newStake.toString().length <= 12) setTempStake(newStake);
    }
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
                readOnly
                maxLength={12}
                placeholder={currentStake.toLocaleString()}
                style={{
                  color: isEditingMoneyButtons ? "#adadad" : "#242424",
                  paddingRight: currentStake > 0 ? "45px" : "15px",
                  pointerEvents: "none",
                }}
                type="text"
                value={currentStake.toLocaleString()}
                onClick={(e) => e.preventDefault()}
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
            {dirtyMoneyButtons.map((value, index) => (
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
                    onAddAmount(value);
                  }
                }}
              >
                {value.toLocaleString()}
              </button>
            ))}

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
                onClick={() => {
                  saveMoneyButtons();
                  setAreMoneyButtonValuesValid(true);
                  setAreMoneyButtonValuesDirty(false);
                  setActiveEditedMoneyButton(undefined);
                  setIsEditingMoneyButtons(false);
                }}
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

          <div className={classes["numbers"]}>
            <div className={classes["flex-al-center"]}>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onAddDigit(1)}
              >
                1
              </button>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onAddDigit(2)}
              >
                2
              </button>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onAddDigit(3)}
              >
                3
              </button>
            </div>
            <div className={classes["flex-al-center"]}>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onAddDigit(4)}
              >
                4
              </button>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onAddDigit(5)}
              >
                5
              </button>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onAddDigit(6)}
              >
                6
              </button>
            </div>
            <div className={classes["flex-al-center"]}>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onAddDigit(7)}
              >
                7
              </button>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onAddDigit(8)}
              >
                8
              </button>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onAddDigit(9)}
              >
                9
              </button>
            </div>
            <div className={classes["flex-al-center"]}>
              <button
                className={cx(classes["primary"], classes["max-btn"])}
                disabled={!isLoggedIn || isEditingMoneyButtons || maxStakeIsLoading}
                type="button"
                onClick={() => onLoadMaxStake()}
              >
                {maxStakeIsLoading ? (
                  <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                ) : (
                  `MAX`
                )}
              </button>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onAddDigit(0)}
              >
                0
              </button>
              <button
                className={classes["outline"]}
                type="button"
                onClick={() => !(isEditingMoneyButtons && activeEditedMoneyButton === undefined) && onRemoveDigit()}
              >
                <i className={classes["icon-back"]} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MobileStakePanel.propTypes = propTypes;
MobileStakePanel.defaultProps = defaultProps;

export default React.memo(MobileStakePanel);
