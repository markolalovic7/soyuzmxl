import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";

import { getAuthTill } from "../../../../../redux/reselect/auth-selector";
import { getRetailTillDetails } from "../../../../../redux/reselect/retail-selector";
import {
  clearTicketPaidOutStatus,
  loadTicketData,
  postTicketPayout,
} from "../../../../../redux/slices/retailTransactionSlice";
import Footer from "../../../components/Footer/components";
import SlipstreamPopup from "../../../components/SlipstreamPopup/SlipstreamPopup";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import withNfcRedirection from "../../../hocs/withNfcRedirection";
import LogoPNG from "../../../img/logo.png";
import { printTicketPayout } from "../../../utils/printer";

const LoadTicketPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { ticketId } = useParams();
  const tillAuth = useSelector(getAuthTill);

  const [amountToPayOut, setAmountToPayOut] = useState(0);
  const [betslipReference, setBetslipReference] = useState("");
  const [searchButtonEnabled, setSearchButtonEnabled] = useState(false);

  const error = useSelector((state) => state.retailTransaction.error);
  const saving = useSelector((state) => state.retailTransaction.saving);
  const ticketPaidOut = useSelector((state) => state.retailTransaction.ticketPaidOut);
  const ticketData = useSelector((state) => state.retailTransaction.ticketData);
  const tillDetails = useSelector(getRetailTillDetails);

  const currencyCode = tillDetails?.currencyCode;

  useEffect(() => {
    if (tillAuth && ticketId && ticketId.length === 9) {
      setBetslipReference(ticketId);
      dispatch(loadTicketData({ betslipReference: ticketId }));
    }
  }, [ticketId, tillAuth]);

  useEffect(() => {
    if (betslipReference.length === 9) {
      setSearchButtonEnabled(true);
    } else {
      setSearchButtonEnabled(false);
    }
  }, [betslipReference]);

  useEffect(() => {
    if (tillAuth && ticketId && ticketId.length === 9) {
      setBetslipReference(ticketId);
      dispatch(loadTicketData({ betslipReference: ticketId }));
    }
  }, [ticketId, tillAuth]);

  useEffect(() => {
    if (ticketPaidOut) {
      const brandName = "Demobet";
      const shopAddress = "Registered Address";
      const shopDescription = tillDetails?.shopDescription;
      const tillDescription = tillDetails?.tillDescription;

      printTicketPayout(
        betslipReference,
        brandName,
        currencyCode,
        amountToPayOut,
        shopAddress,
        shopDescription,
        tillDescription,
      );
    }
  }, [amountToPayOut, ticketPaidOut]);

  const onChangeBetslipReferenceHandler = (value) => {
    // format the value to have a - in between
    const formattedValue = value
      .replace("-", "")
      .toUpperCase()
      .slice(0, 8)
      .replace(/(\S{4})(\S{4})/, "$1-$2");

    setBetslipReference(formattedValue);
  };

  const onLoadTicketHandler = () => {
    dispatch(loadTicketData({ betslipReference }));
  };

  const onPayTicketOutHandler = () => {
    setAmountToPayOut(ticketData.availableForPayout); // save for later when we print out

    dispatch(
      postTicketPayout({ amount: ticketData.availableForPayout, betslipId: ticketData.betslipId, betslipReference }),
    );
  };

  return (
    <div className={classes["slipstream-body"]}>
      <div className={classes["wrapper"]}>
        <header className={classes["header"]}>
          <div className={classes["header__container"]}>
            <div className={classes["header__logo"]} onClick={() => history.push("/")}>
              <img alt="" src={LogoPNG} />
            </div>

            <div className={classes["header__links"]}>
              <Link className={cx(classes["header__link"], classes["link"])} to="/">
                <span className={classes["link__icon"]}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </span>
                <span className={classes["link__text"]}>Back</span>
              </Link>
            </div>
          </div>
        </header>
        <div className={classes["main"]}>
          <div className={classes["main__container"]}>
            <div className={classes["bet-history"]}>
              <div className={classes["bet-history-sidebar"]}>
                <div className={classes["bet-history-sidebar__title"]}>
                  <div className={classes["bet-history-sidebar__number"]} style={{ color: "white" }}>
                    Ticket Number
                  </div>
                  <div className={classes["bet-history-sidebar__input"]}>
                    <input
                      type="search"
                      value={betslipReference}
                      onChange={(e) => onChangeBetslipReferenceHandler(e.target.value)}
                    />
                  </div>
                  <div
                    className={classes["bet-history-sidebar__icon"]}
                    style={{ color: searchButtonEnabled ? "white" : "#7f7f7f" }}
                  >
                    ✔
                  </div>
                </div>
                <div className={classes["bet-history-sidebar__body"]}>
                  <div className={classes["bet-history-sidebar__items"]}>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]}>Shop:</div>
                      <div className={classes["bet-history-sidebar__info"]}>
                        {ticketData ? ticketData.shopDescription : ""}
                      </div>
                    </div>
                    {/* <div */}
                    {/*  className={cx(classes["bet-history-sidebar__item"], { */}
                    {/*    [classes["bet-history-sidebar__item_special"]]: false, */}
                    {/*  })} */}
                    {/* > */}
                    {/*  <div className={classes["bet-history-sidebar__label"]}>OPERATOR:</div> */}
                    {/*  <div className={classes["bet-history-sidebar__info"]}>XXXX</div> */}
                    {/* </div> */}
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]}>CUSTOMER:</div>
                      <div className={classes["bet-history-sidebar__info"]}>
                        {ticketData
                          ? `${`${ticketData.playerFirstName} ${ticketData.playerLastName}`} [${
                              ticketData.playerUsername
                            }]`
                          : ""}
                      </div>
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]} />
                      <div className={classes["bet-history-sidebar__info"]} />
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]}>DATE:</div>
                      <div className={classes["bet-history-sidebar__info"]}>
                        {ticketData ? dayjs(ticketData.createdDate).format("DD MMM YYYY") : ""}
                      </div>
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]}>TIME:</div>
                      <div className={classes["bet-history-sidebar__info"]}>
                        {ticketData ? dayjs(ticketData.createdDate).format("hh:mm:ss A") : ""}
                      </div>
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]}>STATUS:</div>
                      <div className={classes["bet-history-sidebar__info"]}>
                        {ticketData ? ticketData?.betslipStatus : ""}
                      </div>
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]}>PAID OUT DATE:</div>
                      <div className={classes["bet-history-sidebar__info"]}>
                        {ticketData?.lastPaidOutDate
                          ? dayjs.unix(ticketData?.lastPaidOutDate / 1000).format("D MMMM hh:mm A")
                          : "Unpaid"}
                      </div>
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]}>ODDS:</div>
                      <div className={classes["bet-history-sidebar__info"]}>
                        {ticketData ? ticketData?.totalOdds : ""}
                      </div>
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]} />
                      <div className={classes["bet-history-sidebar__info"]} />
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]}>BET TYPE:</div>
                      <div className={classes["bet-history-sidebar__info"]}>
                        {ticketData ? ticketData?.betType : ""}
                      </div>
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]} />
                      <div className={classes["bet-history-sidebar__info"]} />
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]}>POSSIBLE WIN:</div>
                      <div className={classes["bet-history-sidebar__info"]}>
                        {ticketData ? ticketData?.potentialWin?.toLocaleString() : ""}
                      </div>
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]} />
                      <div className={classes["bet-history-sidebar__info"]} />
                    </div>
                    <div
                      className={cx(classes["bet-history-sidebar__item"], {
                        [classes["bet-history-sidebar__item_special"]]: false,
                      })}
                    >
                      <div className={classes["bet-history-sidebar__label"]}>STAKE:</div>
                      <div className={classes["bet-history-sidebar__info"]}>
                        {ticketData ? ticketData?.debit?.toLocaleString() : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={classes["bet-history-sidebar__buttons"]}>
                  <div
                    className={cx(classes["bet-history-sidebar__button"], {
                      [classes["disabled"]]: !searchButtonEnabled,
                    })}
                    style={{ pointerEvents: searchButtonEnabled ? "auto" : "none" }}
                    onClick={onLoadTicketHandler}
                  >
                    Search
                  </div>
                </div>
              </div>
              <div className={classes["bet-history-content"]}>
                <div className={classes["bet-history-content__wrapper"]}>
                  <table className={classes["bet-history-content__table"]}>
                    <tbody>
                      <tr className={classes["bet-history-content__heads"]}>
                        <td className={classes["bet-history-content__list-num"]}>#</td>
                        <td>Start Time</td>
                        <td>Event</td>
                        <td>Outcomes</td>
                        <td>Price</td>
                        <td>Status</td>
                      </tr>
                      {ticketData?.betData?.map(
                        ({ eventDescription, eventStartTime, outcomeDescription, outcomeResult, price }, index) => (
                          <tr className={classes["bet-history-content__the-list"]} key={index}>
                            <td>{index + 1}</td>
                            <td>{dayjs(eventStartTime).format("DD MMM hh:mm A")}</td>
                            <td>{eventDescription}</td>
                            <td>{outcomeDescription}</td>
                            <td>{price}</td>
                            <td>{outcomeResult}</td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
                <div className={classes["bet-history-content__bottom"]}>
                  <div className={classes["bet-history-content__info"]}>
                    <div className={classes["bet-history-content__payout"]}>Payout Info:</div>
                    <div className={classes["bet-history-content__open"]}>
                      <input readOnly="true" type="text" value={ticketData?.betslipStatus} />
                    </div>
                  </div>
                  {ticketData?.betslipStatus !== "NO_RESULT" && ticketData?.availableForPayout > 0 && (
                    <div
                      className={cx(classes["bet-history-content__button"], {
                        [classes["disabled"]]: saving || ticketData.availableForPayout <= 0,
                      })}
                      onClick={onPayTicketOutHandler}
                    >
                      {ticketData.availableForPayout <= 0
                        ? "Not Payable"
                        : `pay [ ${currencyCode} ${ticketData.availableForPayout} ]`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {ticketPaidOut && (
        <SlipstreamPopup
          headerText="Success"
          text="This ticket has been paid out!"
          onClose={() => {
            dispatch(clearTicketPaidOutStatus());
            history.push("/");
          }}
        />
      )}
      {error && (
        <SlipstreamPopup
          headerText="Error"
          text={error}
          onClose={() => {
            dispatch(clearTicketPaidOutStatus());
          }}
        />
      )}
    </div>
  );
};

export default withNfcRedirection(withBarcodeReader(LoadTicketPage));
