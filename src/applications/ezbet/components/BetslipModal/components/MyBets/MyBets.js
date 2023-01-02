import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import CopySvg from "../../../../img/icons/CopySvg.js";
import classes from "../../../../scss/ezbet.module.scss";

import Match from "./components/Match";

const MyBets = ({ activeBet, setActiveBet, setNetworkStatusUnstable, setOpenCashoutQuotationModal }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const activeBetCount = useSelector((state) => state.cashout.activeBetCount);
  const activeBets = useSelector((state) => state.cashout.activeBets);

  const cashoutFailed = useSelector((state) => state.cashout.cashoutFailed);
  const [copied, setCopied] = useState(false);
  const [noValidInfo, setNoValidInfo] = useState(false);

  function selectActiveBetHandler(bet) {
    setActiveBet(bet);
    setOpenCashoutQuotationModal(true);
  }

  // spinning wheel if we are loading
  if (activeBetCount > 0 && isEmpty(activeBets)) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <FontAwesomeIcon
          className="fa-spin"
          icon={faSpinner}
          size="3x"
          style={{
            "--fa-primary-color": "#00ACEE",
            "--fa-secondary-color": "#E6E6E6",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
    );
  }

  return (
    <div data-scroll-lock-scrollable className={cx(classes["full-page-modal-body"], classes["notification-screen"])}>
      <section className={classes["betslip-card-wrapper"]}>
        {activeBets &&
          activeBets.map((bet, index) => {
            const isCashoutFailed = cashoutFailed && activeBet?.betBucketId === bet.betBucketId;

            return (
              <div key={index}>
                {bet.cashoutBetDescriptions.length === 1 && (
                  <div
                    className={cx(
                      classes["betslip-card"],
                      classes["cash-out"],
                      classes["cash-out-single"],
                      //     {
                      //   [classes["betslip-card-failed"]]: isCashoutFailed,
                      // }
                    )}
                    key={index}
                  >
                    <div className={classes["cash-out-inner"]}>
                      {/* {isCashoutFailed && ( */}
                      {/*  <p className={classes["flex-al-center"]} style={{ marginBottom: "15px" }}> */}
                      {/*    <span className={classes["icon-solid-red-alert"]}> */}
                      {/*      <span className={classes["path1"]} /> */}
                      {/*      <span className={classes["path2"]} /> */}
                      {/*      <span className={classes["path3"]} /> */}
                      {/*    </span> */}
                      {/*    <i className={classes["icon-inbox-out-solid"]} /> */}
                      {/*    {t("ez.cashout_could_not_be_processed")} */}
                      {/*  </p> */}
                      {/* )} */}
                      <div className={cx(classes["cash-out-header"], classes["flex-al-center"], classes["w-100"])}>
                        <h2>{t("ez.single")}</h2>
                        <div className={classes["date-time-id"]}>
                          <div className={cx(classes["date-and-time"], classes["flex-al-center"])}>
                            <span>{dayjs.unix(bet.epoch / 1000).format("MM-DD")}</span>
                            &nbsp;
                            <span>{dayjs.unix(bet.epoch / 1000).format("HH:mm")}</span>
                          </div>
                          <CopyToClipboard text={bet.betBucketId} onCopy={() => setCopied(true)}>
                            <span>
                              <i style={{ cursor: "pointer" }}><CopySvg /></i> {bet.betBucketId}
                            </span>
                          </CopyToClipboard>
                        </div>
                      </div>
                      <div className={classes["cash-out-matches"]}>
                        <div
                          className={cx(classes["matches-wrapper"], classes["multiple-matches"], classes["relative"])}
                        >
                          {bet.cashoutBetDescriptions.map((betDescription, i) => (
                            <div key={i}>
                              <Match bet={bet} betDescription={betDescription} />
                            </div>
                          ))}
                          <div className={classes["matches-footer"]}>
                            <div className={cx(classes["flex-al-center"], classes["stake"])}>
                              <p className={classes["krw-wrap"]}>
                                {t("your_amount")}
                                <span className={classes["krw"]}>
                                  {bet.stake ? Math.floor(bet.stake).toLocaleString() : "-"}
                                  <em> KRW</em>
                                </span>
                              </p>
                            </div>
                            <div className={classes["flex-al-center"]}>
                              <p>
                                <span style={{ marginRight: "11px" }}>{t("ez.potential_win")}</span>
                                {Math.floor(bet.potentialWin).toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                  minimumFractionDigits: 0,
                                })}
                              </p>
                              {/* <span className={cx(classes["total"], classes["price"])}>3.65</span> */}
                            </div>
                          </div>
                        </div>

                        <div className={classes["cash-out-matches-footer"]}>
                          <div className={cx(classes["sum"], classes["with-inbox-button"])}>
                            <div className={cx(classes["upload-and-settings-wrapper"], classes["flex-al-center"])}>
                              {!isCashoutFailed && (
                                <button
                                  className={cx(classes["white"], classes["open-cash-out-modal"])}
                                  style={{ cursor: `${bet.disabled ? "default" : "pointer"}` }}
                                  type="button"
                                  onClick={() => !bet.disabled && selectActiveBetHandler(bet)}
                                >
                                  {!bet.disabled && (
                                    <>
                                      <span>{t("ez.cash_out")}</span>
                                      <span>
                                        {bet.quote > bet.stake && <span className={classes["icon-green-up"]} />}
                                        {bet.quote < bet.stake && <span className={classes["icon-red-down"]} />}
                                        {!bet.disabled && Math.floor(bet.quote).toLocaleString()}
                                        <i className={classes["icon-inbox-out-solid"]} />
                                      </span>
                                    </>
                                  )}
                                  {bet.disabled && (
                                    <span className={classes["no-valid-cashout-btn-info"]} style={{ margin: "0 auto" }}>
                                      {t("ez.cash_out_unavailable")}
                                      <i className={classes["icon-not-valid"]} />
                                    </span>
                                  )}
                                </button>
                              )}
                              {/* {isCashoutFailed && ( */}
                              {/*  <button className={cx(classes["white"], classes["open-cash-out-modal"])} type="button"> */}
                              {/*    <span className={classes["no-valid-cashout-btn-info"]}> */}
                              {/*      {t("ez.cash_out_unavailable")} */}
                              {/*      <i className={classes["icon-not-valid"]} /> */}
                              {/*    </span> */}
                              {/*  </button> */}
                              {/* )} */}
                            </div>
                          </div>
                          {/* {isCashoutFailed && (
                            <div>
                              <hr />
                              <p>
                                {t("ez.network_status_unstable")}
                                <br />
                                {t("ez.try_again")}
                              </p>
                              <button
                                className={cx(classes["primary"], classes["confirmation-button"])}
                                type="button"
                                onClick={acknowledgeCashoutError}
                              >
                                <span>{t("ok")}</span>
                              </button>
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {bet.cashoutBetDescriptions.length > 1 && (
                  <div
                    className={cx(
                      classes["betslip-card"],
                      classes["cash-out"],
                      classes["cash-out-multiple"],
                      //     {
                      //   [classes["betslip-card-failed"]]: isCashoutFailed,
                      // }
                    )}
                    key={index}
                  >
                    <div className={classes["cash-out-inner"]}>
                      {/* {isCashoutFailed && ( */}
                      {/*  <p className={classes["flex-al-center"]} style={{ marginBottom: "15px" }}> */}
                      {/*    <span className={classes["icon-solid-red-alert"]}> */}
                      {/*      <span className={classes["path1"]} /> */}
                      {/*      <span className={classes["path2"]} /> */}
                      {/*      <span className={classes["path3"]} /> */}
                      {/*    </span> */}
                      {/*    <i className={classes["icon-inbox-out-solid"]} /> */}
                      {/*    {t("ez.cashout_could_not_be_processed")} */}
                      {/*  </p> */}
                      {/* )} */}
                      <div className={cx(classes["cash-out-header"], classes["flex-al-center"], classes["w-100"])}>
                        <h2>{t("ez.multiple")}</h2>
                        <div className={classes["date-time-id"]}>
                          <div className={cx(classes["date-and-time"], classes["flex-al-center"])}>
                            <span>{dayjs.unix(bet.epoch / 1000).format("MM-DD")}</span>
                            &nbsp;
                            <span>{dayjs.unix(bet.epoch / 1000).format("HH:mm")}</span>
                          </div>
                          <CopyToClipboard text={bet.betslipId} onCopy={() => setCopied(true)}>
                            <span>
                              <i style={{ cursor: "pointer" }}><CopySvg /></i> {bet.betslipId}
                            </span>
                          </CopyToClipboard>
                        </div>
                      </div>
                      <div className={classes["cash-out-matches"]}>
                        <div
                          className={cx(classes["matches-wrapper"], classes["multiple-matches"], classes["relative"])}
                        >
                          <div>
                            {bet.cashoutBetDescriptions.map((betDescription, i) => (
                              <div className={classes["match-wrap"]} key={i}>
                                <Match bet={bet} betDescription={betDescription} />
                              </div>
                            ))}
                          </div>
                          <div className={classes["matches-footer"]}>
                            <div className={cx(classes["flex-al-center"], classes["stake"])}>
                              <p className={classes["krw-wrap"]}>
                                {`${t("ez.total_bet_stake")} : `}
                                <span className={classes["krw"]}>
                                  {bet.stake ? Math.floor(bet.stake).toLocaleString() : "-"}
                                  <em> KRW</em>
                                </span>
                              </p>
                              <span style={{ color: "#525252", margin: "0 0 0 auto" }}>
                                {bet.cashoutBetDescriptions.length} {t("ez.multiple")}
                              </span>
                            </div>
                            <div className={classes["flex-al-center"]}>
                              <p>
                                <span style={{ marginRight: "11px" }}>{t("ez.potential_win")}</span>
                                {Math.floor(bet.potentialWin).toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                  minimumFractionDigits: 0,
                                })}
                              </p>
                              <span className={cx(classes["total"], classes["price"])}>{bet.totalOdds}</span>
                            </div>
                          </div>
                        </div>
                        <div className={classes["cash-out-matches-footer"]}>
                          <div className={cx(classes["sum"], classes["with-inbox-button"])}>
                            <div className={cx(classes["upload-and-settings-wrapper"], classes["flex-al-center"])}>
                              {!isCashoutFailed && (
                                <button
                                  className={cx(classes["white"], classes["open-cash-out-modal"])}
                                  // disabled={bet.disabled}
                                  style={{ cursor: `${bet.disabled ? "default" : "pointer"}` }}
                                  type="button"
                                  onClick={() => !bet.disabled && selectActiveBetHandler(bet)}
                                >
                                  {!bet.disabled && (
                                    <>
                                      <span>{t("ez.cash_out")}</span>
                                      <span>
                                        {bet.quote > bet.stake && <span className={classes["icon-green-up"]} />}
                                        {bet.quote < bet.stake && <span className={classes["icon-red-down"]} />}
                                        {!bet.disabled && Math.floor(bet.quote).toLocaleString()}
                                        <i className={classes["icon-inbox-out-solid"]} />
                                      </span>
                                    </>
                                  )}
                                  {bet.disabled && (
                                    <span className={classes["no-valid-cashout-btn-info"]} style={{ margin: "0 auto" }}>
                                      {t("ez.cash_out_unavailable")}
                                      <i className={classes["icon-not-valid"]} />
                                    </span>
                                  )}
                                </button>
                              )}

                              {/* {isCashoutFailed && ( */}
                              {/*  <button className={cx(classes["white"], classes["open-cash-out-modal"])} type="button"> */}
                              {/*    <span className={classes["no-valid-cashout-btn-info"]}> */}
                              {/*      {t("ez.cash_out_unavailable")} */}
                              {/*      <i className={classes["icon-not-valid"]} /> */}
                              {/*    </span> */}
                              {/*  </button> */}
                              {/* )} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </section>
    </div>
  );
};

MyBets.propTypes = {
  activeBet: PropTypes.object,
  setActiveBet: PropTypes.func,
  setNetworkStatusUnstable: PropTypes.func,
  setOpenCashoutQuotationModal: PropTypes.func,
};
MyBets.defaultProps = {
  activeBet: undefined,
  setActiveBet: undefined,
  setNetworkStatusUnstable: undefined,
  setOpenCashoutQuotationModal: undefined,
};

export default React.memo(MyBets);
