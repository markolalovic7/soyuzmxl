import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getAuthUsername } from "../../../../../redux/reselect/auth-selector";
import { getRetailTillDetails } from "../../../../../redux/reselect/retail-selector";
import {
  clearTicketPaidOutStatus,
  clearTillOperationStatus,
  postTillTransaction,
} from "../../../../../redux/slices/retailTransactionSlice";
import Footer from "../../../components/Footer/components";
import SlipstreamPopup from "../../../components/SlipstreamPopup/SlipstreamPopup";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import withNfcRedirection from "../../../hocs/withNfcRedirection";
import LogoPNG from "../../../img/logo.png";
import { printTillTransaction } from "../../../utils/printer";

const HEAD_OFFICE_ACTION_TYPE = { description: "Head Office", id: 1 };
const INTER_OUTLET_ACTION_TYPE = { description: "Inter-Outlet", id: 2 };
const PARTNER_OPERATOR_TOP_UP_ACTION_TYPE = { description: "Partner / Operator Top-Up", id: 3 };
const BANK_TRANSFER_ACTION_TYPE = { description: "Bank Transfer", id: 4 };
const RFID_CHARGES_ACTION_TYPE = { description: "RFID Charges", id: 5 };

const CASH_IN_TYPES = [
  HEAD_OFFICE_ACTION_TYPE,
  INTER_OUTLET_ACTION_TYPE,
  PARTNER_OPERATOR_TOP_UP_ACTION_TYPE,
  BANK_TRANSFER_ACTION_TYPE,
  RFID_CHARGES_ACTION_TYPE,
];

const DEPOSIT_TO_PARTNER_ACTION_TYPE = { description: "Deposit to Partner/Operator", id: 101 };
const DEPOSIT_TO_BANK_ACTION_TYPE = { description: "Deposit to Bank", id: 102 };

const CASH_OUT_TYPES = [
  HEAD_OFFICE_ACTION_TYPE,
  INTER_OUTLET_ACTION_TYPE,
  DEPOSIT_TO_PARTNER_ACTION_TYPE,
  DEPOSIT_TO_BANK_ACTION_TYPE,
];

const TillTransactionsPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [activeTabIndex, setActiveTabIndex] = useState(1);
  const [cashInType, setCashInType] = useState(0);
  const [cashOutType, setCashOutType] = useState(0);

  const [cashInAmount, setCashInAmount] = useState(0);
  const [cashOutAmount, setCashOutAmount] = useState(0);

  const error = useSelector((state) => state.retailTransaction.error);
  const saving = useSelector((state) => state.retailTransaction.saving);
  const tillAdjustmentCompleted = useSelector((state) => state.retailTransaction.tillAdjustmentCompleted);
  const savedAdjustmentId = useSelector((state) => state.retailTransaction.savedAdjustmentId);

  const username = useSelector(getAuthUsername);
  const tillDetails = useSelector(getRetailTillDetails);

  const currencyCode = tillDetails?.currencyCode;

  useEffect(() => {
    if (tillAdjustmentCompleted) {
      printTillTransaction(
        currencyCode,
        savedAdjustmentId,
        username,
        new Date(),
        activeTabIndex === 1 ? cashInType : cashOutType,
        activeTabIndex === 1,
        activeTabIndex === 2,
        activeTabIndex === 1 ? cashInAmount : cashOutAmount,
      );
    }
  }, [
    activeTabIndex,
    cashInAmount,
    cashOutAmount,
    cashInType,
    cashOutType,
    currencyCode,
    savedAdjustmentId,
    tillAdjustmentCompleted,
  ]);

  return (
    <div className={classes["slipstream-body"]}>
      <div className={classes["wrapper"]}>
        <header className={classes["header"]}>
          <div className={classes["header__container"]}>
            <div className={classes["header__logo"]}>
              <img alt="" src={LogoPNG} />
            </div>

            <div className={classes["header__links"]}>
              <a className={cx(classes["header__link"], classes["link"])} href="#">
                <span className={classes["link__icon"]}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </span>
                <span className={classes["link__text"]}>Back</span>
              </a>
            </div>
          </div>
        </header>
        <div className={classes["main"]}>
          <div className={classes["main__container"]}>
            <div className={classes["transaction-page"]}>
              <div className={cx(classes["main__title"], classes["main__title_bold"])}>
                <div className={classes["main__title-text"]}>Other transactions</div>
              </div>
              <div className={classes["transaction-page__buttons"]}>
                <div
                  className={cx(classes["transaction-page__button"], { [classes["active"]]: activeTabIndex === 1 })}
                  onClick={() => setActiveTabIndex(1)}
                >
                  Cash in
                </div>
                <div
                  className={cx(classes["transaction-page__button"], { [classes["active"]]: activeTabIndex === 2 })}
                  onClick={() => setActiveTabIndex(2)}
                >
                  Cash out
                </div>
              </div>
              <div className={classes["transaction-page__body"]}>
                <div action="#" className={classes["transaction-page__form"]}>
                  <div className={classes["transaction-page__select"]}>
                    {activeTabIndex === 1 && (
                      <select
                        id="oth-trans-selector"
                        value={cashInType}
                        onChange={(e) => setCashInType(Number(e.target.value))}
                      >
                        <option disabled selected value={0}>
                          Select transaction
                        </option>
                        {CASH_IN_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.description}
                          </option>
                        ))}
                      </select>
                    )}
                    {activeTabIndex === 2 && (
                      <select
                        id="oth-trans-selector"
                        value={cashOutType}
                        onChange={(e) => setCashOutType(Number(e.target.value))}
                      >
                        <option disabled selected value={0}>
                          Select transaction
                        </option>
                        {CASH_OUT_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.description}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className={classes["transaction-page__amount"]}>
                    <div className={classes["transaction-page__label"]}>Amount</div>
                    <div className={classes["transaction-page__input"]}>
                      <input
                        type="number"
                        value={activeTabIndex === 1 ? cashInAmount : cashOutAmount}
                        onChange={(e) =>
                          activeTabIndex === 1
                            ? setCashInAmount(Number(e.target.value))
                            : setCashOutAmount(Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                  <div className={classes["transaction-page__confirm"]}>
                    <button
                      className={cx(classes["main__button"], {
                        [classes["disabled"]]:
                          saving ||
                          (activeTabIndex === 1 ? cashInAmount : cashOutAmount) <= 0 ||
                          (activeTabIndex === 1 ? cashInType : cashOutType) <= 0,
                      })}
                      type="submit"
                      onClick={() =>
                        dispatch(
                          postTillTransaction({
                            amount: activeTabIndex === 1 ? cashInAmount : cashOutAmount,
                            description:
                              activeTabIndex === 1
                                ? CASH_IN_TYPES.find((type) => type.id === cashInType)?.description
                                : CASH_OUT_TYPES.find((type) => type.id === cashOutType)?.description,
                            isCashIn: activeTabIndex === 1,
                            isCashout: activeTabIndex === 2,
                          }),
                        )
                      }
                    >
                      Confirm Transaction
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        {tillAdjustmentCompleted && (
          <SlipstreamPopup
            headerText="Success"
            text="Cash Operation Completed!"
            onClose={() => {
              dispatch(clearTillOperationStatus());
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
    </div>
  );
};

export default withNfcRedirection(withBarcodeReader(TillTransactionsPage));
