import { faGift, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import * as PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useOnClickOutside } from "../../../../../../hooks/utils-hooks";
import {
  getGlobalPotentialWin,
  getGlobalTotalCashStake,
  getGlobalTotalFreeBetStake,
  getGlobalTotalPromoSnrStake,
  getGlobalTotalPromoStake,
  getGlobalTotalStake,
} from "../../../../../../utils/betslip-utils";
import classes from "../../../../scss/vanilladesktop.module.scss";

const BetslipTotals = ({ betslipData, currencyCode, dirtyPotentialWin }) => {
  const { t } = useTranslation();

  const [isStakePanelOpen, setIsStakePanelOpen] = useState(false);
  const stakePanelRef = useRef();
  useOnClickOutside(stakePanelRef, () => setIsStakePanelOpen(false));

  const [isBonusPanelOpen, setIsBonusPanelOpen] = useState(false);
  const bonusPanelRef = useRef();
  useOnClickOutside(bonusPanelRef, () => setIsBonusPanelOpen(false));

  const cashStake = getGlobalTotalCashStake(betslipData);
  const promoStake = getGlobalTotalPromoStake(betslipData);
  const promoSnrStake = getGlobalTotalPromoSnrStake(betslipData);
  const freeBetStake = getGlobalTotalFreeBetStake(betslipData);

  return (
    <div className={classes["betslip__count"]}>
      {betslipData?.qualifyingRewards?.length > 0 && (
        <div className={classes["betslip__cashout"]} ref={bonusPanelRef}>
          <div
            className={cx(classes["betslip__cashout-button"], classes["dropdown"], {
              [classes["active"]]: isBonusPanelOpen,
            })}
            onClick={() => setIsBonusPanelOpen((prevState) => !prevState)}
          >
            <span className={classes["betslip__cashout-icon"]}>
              <FontAwesomeIcon icon={faGift} />
            </span>
            <div className={classes["betslip__cashout-text"]}>{t("eligible_for_promotions")}</div>
          </div>
          <div
            className={cx(classes["header__dropdown-content"], classes["dropdown"], {
              [classes["open"]]: isBonusPanelOpen,
            })}
          >
            <ul>
              {betslipData?.qualifyingRewards?.map((reward, index) => (
                <li className={classes["header__dropdown-theme"]} key={index}>
                  <div className={classes["header__dropdown-box"]}>
                    <div className={classes["header__dropdown-promo"]}>
                      {`${reward.description} - [${getSymbolFromCurrency(currencyCode)} ${reward.rewardAmount}]`}
                    </div>
                    <div className={classes["header__dropdown-money"]}>{reward.notes}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className={classes["betslip__box"]}>
        <div className={classes["betslip__money"]}>
          <div className={classes["betslip__total"]}>
            <span>{t("betslip_panel.total_stake")}</span>
            <span>
              {`${getSymbolFromCurrency(currencyCode)} ${getGlobalTotalStake(betslipData).toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}`}
            </span>
          </div>
          <div className={classes["betslip__returns"]}>
            <span>{t("betslip_panel.potential_returns")}</span>
            <span>
              {dirtyPotentialWin
                ? ""
                : `${getSymbolFromCurrency(currencyCode)} ${getGlobalPotentialWin(betslipData) // - getGlobalTotalStake(betslipData)
                    .toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}`}
            </span>
          </div>
        </div>
        {(promoStake > 0 || promoSnrStake > 0 || freeBetStake > 0) && (
          <div className={classes["betslip__information"]} ref={stakePanelRef}>
            <div
              className={cx(classes["betslip__description"], classes["dropdown"], {
                [classes["active"]]: isStakePanelOpen,
              })}
              onClick={() => setIsStakePanelOpen((prevState) => !prevState)}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
            <div
              className={cx(classes["header__dropdown-content"], classes["dropdown"], {
                [classes["open"]]: isStakePanelOpen,
              })}
            >
              <ul>
                <li className={classes["header__dropdown-theme"]}>
                  <div className={classes["header__dropdown-box"]}>
                    <div className={classes["header__dropdown-promo"]}>{t("balance.cash_balance")}</div>
                    <div className={classes["header__dropdown-money"]}>
                      {`${getSymbolFromCurrency(currencyCode)} ${cashStake.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}`}
                    </div>
                  </div>
                </li>
                {promoStake > 0 && (
                  <li className={classes["header__dropdown-theme"]}>
                    <div className={classes["header__dropdown-box"]}>
                      <div className={classes["header__dropdown-promo"]}>{t("balance.promo_balance")}</div>
                      <div className={classes["header__dropdown-money"]}>
                        {`${getSymbolFromCurrency(currencyCode)} ${promoStake.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}`}
                      </div>
                    </div>
                  </li>
                )}
                {promoSnrStake > 0 && (
                  <li className={classes["header__dropdown-theme"]}>
                    <div className={classes["header__dropdown-box"]}>
                      <div className={classes["header__dropdown-promo"]}>{t("balance.promo_snr_balance")}</div>
                      <div className={classes["header__dropdown-money"]}>
                        {`${getSymbolFromCurrency(currencyCode)} ${promoSnrStake.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}`}
                      </div>
                    </div>
                  </li>
                )}
                {freeBetStake > 0 && (
                  <li className={classes["header__dropdown-theme"]}>
                    <div className={classes["header__dropdown-box"]}>
                      <div className={classes["header__dropdown-promo"]}>{t("balance.free_bet_balance")}</div>
                      <div className={classes["header__dropdown-money"]}>
                        {`${getSymbolFromCurrency(currencyCode)} ${freeBetStake.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}`}
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

BetslipTotals.propTypes = {
  betslipData: PropTypes.any.isRequired,
  currencyCode: PropTypes.any.isRequired,
  dirtyPotentialWin: PropTypes.any.isRequired,
};

export default React.memo(BetslipTotals);
