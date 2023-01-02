import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import isEmpty from "lodash.isempty";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { useLocation } from "react-router-dom";

import { getAuthTill } from "../../../../../redux/reselect/auth-selector";
import {
  getRetailPlayerAccountBalance,
  getRetailSelectedPlayerAccountData,
  getRetailSelectedPlayerAccountId,
  getRetailTillDetails,
} from "../../../../../redux/reselect/retail-selector";
import { getCountries } from "../../../../../redux/slices/countrySlice";
import { getRetailPlayerAccountPhoto, setRetailPlayerAccountId } from "../../../../../redux/slices/retailAccountSlice";
import { isNotEmpty } from "../../../../../utils/lodash";
import Footer from "../../../components/Footer/components";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import withNfcRedirection from "../../../hocs/withNfcRedirection";
import LogoPNG from "../../../img/logo.png";
import { getAge } from "../../../utils/ageUtils";
import { printPlayerBalance } from "../../../utils/printer";

const AccountViewPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const search = useLocation().search;
  const origin = new URLSearchParams(search).get("origin") || "SEARCH"; // SEARCH vs DIRECT - where the navigation comes from...

  const { accountId: accountIdStr } = useParams();
  const accountId = accountIdStr ? Number(accountIdStr) : undefined;

  const selectedPlayerId = useSelector(getRetailSelectedPlayerAccountId);
  const selectedPlayerBalance = useSelector(getRetailPlayerAccountBalance);
  const selectedPlayerAccountData = useSelector(getRetailSelectedPlayerAccountData);
  const countries = useSelector((state) => state.country?.countries);
  const tillAuth = useSelector(getAuthTill);
  const tillDetails = useSelector(getRetailTillDetails);
  const existingImgSrc = useSelector((state) => state.retailAccount.playerAccountPhoto);

  useEffect(() => {
    // if the page is reloaded, re-populate the current player account ID off the URL.
    if (!selectedPlayerId) {
      dispatch(setRetailPlayerAccountId({ accountId }));
    }
  }, [selectedPlayerId]);

  useEffect(() => {
    // if the page is reloaded, re-populate the current player account ID off the URL.
    if (selectedPlayerId && tillAuth) {
      dispatch(getRetailPlayerAccountPhoto({ accountId: selectedPlayerId }));
    }
  }, [selectedPlayerId, tillAuth]);

  useEffect(() => {
    if (isEmpty(countries)) {
      dispatch(getCountries());
    }
  }, []);

  const onBackHandler = () => {
    if (origin === "SEARCH") {
      dispatch(setRetailPlayerAccountId({ accountId: undefined })); // clear the user selection, given the user did not proceed.
      history.push("/accountsearch");
    } else {
      // DIRECT
      history.push("/");
    }
  };

  const onGoHomeHandler = () => {
    dispatch(setRetailPlayerAccountId({ accountId: undefined })); // clear the user selection, given the user did not proceed.
    history.push("/");
  };

  const onPrintPlayerBalanceHandler = () => {
    const accountName = selectedPlayerAccountData
      ? `${selectedPlayerAccountData?.firstName} ${selectedPlayerAccountData?.lastName}`
      : "";
    const brandName = "Demobet"; // TODO long term this shold come from the CMS config
    const currencyCode = tillDetails?.currencyCode;
    const promoBalance = selectedPlayerBalance?.promoBalance;
    const promoSnrBalance = selectedPlayerBalance?.promoSnrBalance;
    const realBalance = selectedPlayerBalance?.cashBalance;
    const shopAddress = "Registered Address";
    const shopDescription = tillDetails?.shopDescription;
    const tillDescription = tillDetails?.tillDescription;
    const username = selectedPlayerAccountData?.username;

    printPlayerBalance(
      accountName,
      brandName,
      currencyCode,
      promoBalance,
      promoSnrBalance,
      realBalance,
      shopAddress,
      shopDescription,
      tillDescription,
      username,
    );
  };

  return (
    <div className={classes["slipstream-body"]}>
      <div className={classes["wrapper"]}>
        <header className={classes["header"]}>
          <div className={classes["header__container"]}>
            <div className={classes["header__logo"]} onClick={onGoHomeHandler}>
              <img alt="" src={LogoPNG} />
            </div>

            <div className={classes["header__links"]}>
              <div className={cx(classes["header__link"], classes["link"])} onClick={onBackHandler}>
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
            <div className={classes["account-details"]}>
              <div className={classes["account-details__container"]}>
                <div className={classes["account-summary"]}>
                  <div className={classes["account-details__title"]}>Account Summary</div>
                  <div className={classes["account-summary__body"]}>
                    <div className={classes["account-summary__photo"]}>
                      {existingImgSrc ? <img alt="old pic" src={existingImgSrc} /> : "No photo yet"}
                    </div>
                    <div className={classes["account-summary__name"]}>
                      {selectedPlayerAccountData?.firstName
                        ? `${selectedPlayerAccountData.firstName}${
                            isNotEmpty(selectedPlayerAccountData.middleName)
                              ? ` ${selectedPlayerAccountData.middleName} `
                              : " "
                          }${selectedPlayerAccountData.lastName}`
                        : ""}
                    </div>
                    <div className={classes["account-summary__info"]}>
                      <div className={classes["account-summary__global"]}>
                        {selectedPlayerAccountData?.dob
                          ? `${getAge(selectedPlayerAccountData.dob)}${
                              selectedPlayerAccountData?.sex ? ` / ${selectedPlayerAccountData?.sex}` : ""
                            }`
                          : ""}
                      </div>
                      <div className={classes["account-summary__label"]}>Age / Gender</div>
                    </div>
                    <div className={classes["account-summary__info"]}>
                      <div className={classes["account-summary__username"]}>{selectedPlayerAccountData?.username}</div>
                      <div className={classes["account-summary__label"]}>Username</div>
                    </div>
                    <div className={classes["account-summary__info"]}>
                      <div className={classes["account-summary__email"]}>
                        {selectedPlayerAccountData?.email ? selectedPlayerAccountData.email : ""}
                      </div>
                      <div className={classes["account-summary__label"]}>Email</div>
                    </div>
                  </div>
                  <div className={classes["account-details__control"]}>
                    <div className={classes["account-details__buttons"]}>
                      <button className={classes["account-details__button"]}>Request Balance</button>
                      <button className={classes["account-details__button"]}>Cash In / Cash Out</button>
                    </div>
                  </div>
                </div>
                <div className={classes["other-information"]}>
                  <div className={classes["account-details__title"]}>Other Information</div>
                  <div className={classes["other-information__body"]}>
                    <div className={classes["other-information__notification"]}>
                      <i style={{ color: selectedPlayerAccountData?.accountTypeId === 1 ? "black" : "red" }}>
                        {selectedPlayerAccountData?.accountTypeId === 1 ? "✓" : "✗"}
                      </i>
                      <span style={{ color: selectedPlayerAccountData?.accountTypeId === 1 ? "black" : "red" }}>
                        {`Customer is${selectedPlayerAccountData?.accountTypeId === 1 ? " " : " NOT "}allowed to bet.`}
                      </span>
                    </div>
                    <div className={classes["other-information__items"]}>
                      <div className={classes["other-information__item"]}>
                        <div className={classes["other-information__label"]}>Date of Birth :</div>
                        <div className={classes["other-information__text"]}>
                          {selectedPlayerAccountData?.dob
                            ? dayjs(selectedPlayerAccountData.dob).format("DD-MMM-YYYY")
                            : ""}
                        </div>
                      </div>
                      <div className={classes["other-information__item"]}>
                        <div className={classes["other-information__label"]}>Mobile Number :</div>
                        <div className={classes["other-information__text"]}>
                          {selectedPlayerAccountData?.mobile ? selectedPlayerAccountData?.mobile : ""}
                        </div>
                      </div>
                      <div className={classes["other-information__item"]}>
                        <div className={classes["other-information__label"]}>Address :</div>
                        <div className={classes["other-information__text"]}>
                          {selectedPlayerAccountData?.address1 ? selectedPlayerAccountData.address1 : " "}
                          {selectedPlayerAccountData?.address2 ? selectedPlayerAccountData.address2 : " "}
                          {selectedPlayerAccountData?.address3 ? selectedPlayerAccountData.address3 : " "}
                          {selectedPlayerAccountData?.address4 ? selectedPlayerAccountData.address4 : " "}
                        </div>
                      </div>
                      <div className={classes["other-information__item"]}>
                        <div className={classes["other-information__label"]}>Postcode :</div>
                        <div className={classes["other-information__text"]}>
                          {selectedPlayerAccountData?.postcode ? selectedPlayerAccountData.postcode : " "}
                        </div>
                      </div>
                      <div className={classes["other-information__item"]}>
                        <div className={classes["other-information__label"]}>Country :</div>
                        <div className={classes["other-information__text"]}>
                          {countries && selectedPlayerAccountData?.countryCode
                            ? countries.find((x) => x.isoCode2 === selectedPlayerAccountData?.countryCode)?.description
                            : ""}
                        </div>
                      </div>
                      <div className={classes["other-information__item"]}>
                        <div className={classes["other-information__label"]}>ID Type :</div>
                        <div className={classes["other-information__text"]} />
                      </div>
                      <div className={classes["other-information__item"]}>
                        <div className={classes["other-information__label"]}>ID Number :</div>
                        <div
                          className={cx(classes["other-information__text"], {
                            [classes["other-information__text_error"]]: !selectedPlayerAccountData?.identityCardNumber,
                          })}
                        >
                          <span
                            className={classes["other-information__icon"]}
                            style={{ color: selectedPlayerAccountData?.identityCardNumber ? "#7f7f7f" : "red" }}
                          >
                            {selectedPlayerAccountData?.identityCardNumber ? "✓" : "✗"}
                          </span>
                          {selectedPlayerAccountData?.identityCardNumber
                            ? selectedPlayerAccountData.identityCardNumber
                            : "No ID presented"}
                        </div>
                      </div>
                      <div className={classes["other-information__item"]}>
                        <div className={classes["other-information__label"]}>ID Type 2:</div>
                        <div className={classes["other-information__text"]} />
                      </div>
                      <div className={classes["other-information__item"]}>
                        <div className={classes["other-information__label"]}>ID Number 2:</div>
                        <div
                          className={cx(classes["other-information__text"], {
                            [classes["other-information__text_error"]]: true,
                          })}
                        >
                          <span className={classes["other-information__icon"]}>✗</span> No ID presented
                        </div>
                      </div>
                      {/* <div className={classes["other-information__item"]}> */}
                      {/*  <div className={classes["other-information__label"]}>Security Question 1:</div> */}
                      {/*  <div className={classes["other-information__text"]}>Favourite Team</div> */}
                      {/* </div> */}
                      {/* <div className={classes["other-information__item"]}> */}
                      {/*  <div className={classes["other-information__label"]}>Security Answer 1:</div> */}
                      {/*  <div className={classes["other-information__text"]}>******</div> */}
                      {/* </div> */}
                      <div className={classes["other-information__item"]}>
                        <div className={classes["other-information__label"]}>NFC Card :</div>
                        <div
                          className={cx(classes["other-information__text"], classes["other-information__text_error"])}
                        >
                          <span className={classes["other-information__icon"]}>✗</span> No registered NFC card yet
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={classes["account-details__control"]}>
                    <div className={classes["account-details__buttons"]}>
                      <button
                        className={classes["account-details__button"]}
                        disabled={!selectedPlayerBalance || !selectedPlayerAccountData || !tillDetails}
                        type="button"
                        onClick={onPrintPlayerBalanceHandler}
                      >
                        Print Balance
                      </button>
                      <button
                        className={classes["account-details__button"]}
                        type="button"
                        onClick={() => history.push(`/photoassign/${accountId}`)}
                      >
                        Edit Photo
                      </button>
                      <button
                        className={classes["account-details__button"]}
                        type="button"
                        onClick={() => history.push(`/nfcassign/${accountId}`)}
                      >
                        Edit NFC
                      </button>
                      <button
                        className={classes["account-details__button"]}
                        type="button"
                        onClick={() => history.push("/")}
                      >
                        Place Bet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default withNfcRedirection(withBarcodeReader(AccountViewPage));
