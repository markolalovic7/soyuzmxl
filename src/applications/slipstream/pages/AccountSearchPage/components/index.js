import { faArrowLeft, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";
import isEmpty from "lodash.isempty";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import {
  searchAccountData,
  setClearPinValidationState,
  setRetailPlayerAccountId,
  validatePin,
} from "../../../../../redux/slices/retailAccountSlice";
import { getDatejsObject } from "../../../../../utils/dayjs";
import { formatDateYearMonthDay } from "../../../../../utils/dayjs-format";
import { isNotEmpty } from "../../../../../utils/lodash";
import Footer from "../../../components/Footer/components";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import withNfcRedirection from "../../../hocs/withNfcRedirection";
import LogoPNG from "../../../img/logo.png";
import { getAge } from "../../../utils/ageUtils";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

function getRandomDigitPositions() {
  const arr = [0, 1, 2, 3, 4, 5];
  let n = 2;

  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  if (n > len) throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }

  return result.sort((a, b) => a - b);
}

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

const AccountSearchPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [accountIdForPinValidation, setAccountIdForPinValidation] = useState(undefined);
  const [pinValidationPositions, setPinValidationPositions] = useState([1, 2]);

  const [digit1, setDigit1] = useState("");
  const [digit2, setDigit2] = useState("");
  const [digit3, setDigit3] = useState("");
  const [digit4, setDigit4] = useState("");
  const [digit5, setDigit5] = useState("");
  const [digit6, setDigit6] = useState("");

  const searchResults = useSelector((state) => state.retailAccount.accountSearchResults);
  const validatingPin = useSelector((state) => state.retailAccount.validatingPin);
  const pinValidationError = useSelector((state) => state.retailAccount.pinValidationError);
  const pinValidationSuccess = useSelector((state) => state.retailAccount.pinValidationSuccess);

  const [input1Ref, setInput1Focus] = useFocus();
  const [input2Ref, setInput2Focus] = useFocus();
  const [input3Ref, setInput3Focus] = useFocus();
  const [input4Ref, setInput4Focus] = useFocus();
  const [input5Ref, setInput5Focus] = useFocus();
  const [input6Ref, setInput6Focus] = useFocus();

  useEffect(() => {
    if (pinValidationSuccess) {
      dispatch(setRetailPlayerAccountId({ accountId: accountIdForPinValidation }));
      history.push(`/accountview/${accountIdForPinValidation}?origin=SEARCH`);
      dispatch(setClearPinValidationState());
    }
  }, [pinValidationSuccess]);

  useEffect(() => {
    if (username.length >= 3) {
      setIsSearchEnabled(true);
    }
    if (firstName.length >= 3) {
      setIsSearchEnabled(true);
    }
    if (lastName.length >= 3) {
      setIsSearchEnabled(true);
    }
    if (email.length >= 3) {
      setIsSearchEnabled(true);
    }
  }, [username, firstName, lastName, email]);

  useEffect(() => {
    if (accountIdForPinValidation) {
      const positions = getRandomDigitPositions();
      setPinValidationPositions(positions);
    }
  }, [accountIdForPinValidation]);

  useEffect(() => {
    if (isPinModalOpen && pinValidationPositions?.length > 0) {
      setTimeout(() => {
        switch (pinValidationPositions[0]) {
          case 0:
            setInput1Focus();
            break;
          case 1:
            setInput2Focus();
            break;
          case 2:
            setInput3Focus();
            break;
          case 3:
            setInput4Focus();
            break;
          case 4:
            setInput5Focus();
            break;
          case 5:
            setInput6Focus();
            break;
          default:
          //
        }
      }, 200);
    }
  }, [isPinModalOpen, pinValidationPositions]);

  const onSearchHandler = () => {
    const data = {};

    if (isNotEmpty(username.trim())) {
      data["usernameSearch"] = username;
    }
    if (isNotEmpty(firstName.trim())) {
      data["firstNameSearch"] = username;
    }
    if (isNotEmpty(lastName.trim())) {
      data["lastNameSearch"] = username;
    }
    if (isNotEmpty(email.trim())) {
      data["emailSearch"] = username;
    }

    if (isNotEmpty(data)) {
      dispatch(searchAccountData(data));
    }
  };

  const onSelectPlayerHandler = (accountId) => {
    setAccountIdForPinValidation(accountId);
    setIsPinModalOpen(true);
  };

  const onDigitEntered = (position) => {
    if (position === pinValidationPositions[0]) {
      // jump to the second position now
      switch (pinValidationPositions[1]) {
        case 0:
          setInput1Focus();
          break;
        case 1:
          setInput2Focus();
          break;
        case 2:
          setInput3Focus();
          break;
        case 3:
          setInput4Focus();
          break;
        case 4:
          setInput5Focus();
          break;
        case 5:
          setInput6Focus();
          break;
        default:
        //
      }
    }
  };

  const onValidatePin = () => {
    const digitData = {};
    pinValidationPositions.forEach((position) => {
      switch (position) {
        case 0:
          digitData[position] = digit1;
          break;
        case 1:
          digitData[position] = digit2;
          break;
        case 2:
          digitData[position] = digit3;
          break;
        case 3:
          digitData[position] = digit4;
          break;
        case 4:
          digitData[position] = digit5;
          break;
        case 5:
          digitData[position] = digit6;
          break;
        default:
        //
      }
    });

    dispatch(validatePin({ accountId: accountIdForPinValidation, digitData }));

    // request validation... dispatch. while loading, fontawesome stuff... error - display
    // if success --> navigate (and clear success).
  };
  const onClosePinValidation = () => {
    setAccountIdForPinValidation(undefined);
    setIsPinModalOpen(false);
    setDigit1("");
    setDigit2("");
    setDigit3("");
    setDigit4("");
    setDigit5("");
    setDigit6("");
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
            <div className={classes["customer-search"]}>
              <div className={classes["customer-search__container"]}>
                <div className={classes["search-bar"]}>
                  <div className={classes["search-bar__title"]}>Search customer:</div>
                  <div className={classes["search-bar__form"]}>
                    <div className={classes["search-bar__inputs"]}>
                      <input
                        className={classes["search-bar__input"]}
                        placeholder="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <input
                        className={classes["search-bar__input"]}
                        placeholder="First Name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <input
                        className={classes["search-bar__input"]}
                        placeholder="Last Name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <input
                        className={classes["search-bar__input"]}
                        placeholder="Email Address"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className={classes["search-bar__buttons"]}>
                      <div
                        className={cx(classes["search-bar__button"], { [classes["disabled"]]: !isSearchEnabled })}
                        onClick={onSearchHandler}
                      >
                        Search
                      </div>
                      <button
                        className={cx(classes["search-bar__button"], { [classes["disabled"]]: true })}
                        type="submit"
                      >
                        History
                      </button>
                    </div>
                  </div>
                </div>
                <div className={classes["search-results"]}>
                  <div className={classes["search-results__title"]}>
                    <div className={classes["search-results__label"]}>
                      {isEmpty(searchResults)
                        ? "No search results"
                        : `Search results: ${searchResults.length} accounts found`}
                    </div>
                    <div className={classes["search-results__cross"]}>
                      <FontAwesomeIcon icon={faTimes} />
                    </div>
                  </div>
                  <div className={cx(classes["search-results__table"], classes["search-table"])}>
                    <div className={classes["search-table__headings"]}>
                      <div className={cx(classes["search-table__heading"], classes["search-table__heading_firstName"])}>
                        First Name
                      </div>
                      <div className={cx(classes["search-table__heading"], classes["search-table__heading_lastName"])}>
                        Last Name
                      </div>
                      <div
                        className={cx(classes["search-table__heading"], classes["search-table__heading_middleName"])}
                      >
                        Username
                      </div>
                      <div className={cx(classes["search-table__heading"], classes["search-table__heading_email"])}>
                        Email
                      </div>
                      <div className={cx(classes["search-table__heading"], classes["search-table__heading_mobile"])}>
                        Mobile
                      </div>
                      <div className={cx(classes["search-table__heading"], classes["search-table__heading_birth"])}>
                        Date of Birth
                      </div>
                      <div className={cx(classes["search-table__heading"], classes["search-table__heading_age"])}>
                        Age
                      </div>
                    </div>
                    <div className={classes["search-table__body"]}>
                      {isNotEmpty(searchResults) &&
                        searchResults.map((account) => (
                          <div
                            className={classes["search-table__row"]}
                            key={account.id}
                            onClick={() => onSelectPlayerHandler(account.id)}
                          >
                            <div className={cx(classes["search-table__item"], classes["search-table__item_firstName"])}>
                              {account.firstName}
                            </div>
                            <div className={cx(classes["search-table__item"], classes["search-table__item_lastName"])}>
                              {account.lastName}
                            </div>
                            <div
                              className={cx(classes["search-table__item"], classes["search-table__item_middleName"])}
                            >
                              {account.username}
                            </div>
                            <div className={cx(classes["search-table__item"], classes["search-table__item_email"])}>
                              {account.email}
                            </div>
                            <div className={cx(classes["search-table__item"], classes["search-table__item_mobile"])}>
                              {account.mobile}
                            </div>
                            <div className={cx(classes["search-table__item"], classes["search-table__item_birth"])}>
                              {account.dob && formatDateYearMonthDay(getDatejsObject(account.dob))}
                            </div>
                            <div className={cx(classes["search-table__item"], classes["search-table__item_age"])}>
                              {account.dob && getAge(account.dob)}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className={classes["search-table__buttons"]}>
                      <div className={classes["search-table__button"]} onClick={() => history.push("/accountcreate")}>
                        New Customer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <div className={cx(classes["popup"], { [classes["open"]]: isPinModalOpen })} id="popup-validate">
        <div className={classes["popup__body"]}>
          <div className={classes["popup__content"]}>
            <div className={classes["popup__title"]}>Validate Pin</div>
            <div className={classes["popup__box"]}>
              <div className={classes["popup__notification"]}>
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Please validate the customer's PIN</span>
              </div>
              {pinValidationError && (
                <div className={classes["popup__label"]} style={{ color: "red" }}>
                  {pinValidationError}
                </div>
              )}
              <div className={classes["popup__label"]}>{`Please enter the ${pinValidationPositions[0] + 1} and ${
                pinValidationPositions[1] + 1
              } digit of customer's PIN`}</div>
              <div className={classes["popup__password"]}>
                <input
                  className={cx(classes["popup__input"], {
                    [classes["disabled"]]: !pinValidationPositions.includes(0),
                  })}
                  maxLength="1"
                  ref={input1Ref}
                  type="password"
                  value={digit1}
                  onChange={(e) => {
                    setDigit1(e.target.value);
                    onDigitEntered(0);
                  }}
                />
                <input
                  className={cx(classes["popup__input"], {
                    [classes["disabled"]]: !pinValidationPositions.includes(1),
                  })}
                  maxLength="1"
                  ref={input2Ref}
                  type="password"
                  value={digit2}
                  onChange={(e) => {
                    setDigit2(e.target.value);
                    onDigitEntered(1);
                  }}
                />
                <input
                  className={cx(classes["popup__input"], {
                    [classes["disabled"]]: !pinValidationPositions.includes(2),
                  })}
                  maxLength="1"
                  ref={input3Ref}
                  type="password"
                  value={digit3}
                  onChange={(e) => {
                    setDigit3(e.target.value);
                    onDigitEntered(2);
                  }}
                />
                <input
                  className={cx(classes["popup__input"], {
                    [classes["disabled"]]: !pinValidationPositions.includes(3),
                  })}
                  maxLength="1"
                  ref={input4Ref}
                  type="password"
                  value={digit4}
                  onChange={(e) => {
                    setDigit4(e.target.value);
                    onDigitEntered(3);
                  }}
                />
                <input
                  className={cx(classes["popup__input"], {
                    [classes["disabled"]]: !pinValidationPositions.includes(4),
                  })}
                  maxLength="1"
                  ref={input5Ref}
                  type="password"
                  value={digit5}
                  onChange={(e) => {
                    setDigit5(e.target.value);
                    onDigitEntered(4);
                  }}
                />
                <input
                  className={cx(classes["popup__input"], {
                    [classes["disabled"]]: !pinValidationPositions.includes(5),
                  })}
                  maxLength="1"
                  ref={input6Ref}
                  type="password"
                  value={digit6}
                  onChange={(e) => {
                    setDigit6(e.target.value);
                    onDigitEntered(5);
                  }}
                />
              </div>
            </div>
            <div className={classes["popup__buttons"]}>
              <div className={classes["popup__button"]} onClick={onValidatePin}>
                {validatingPin ? (
                  <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                ) : (
                  "ok"
                )}
              </div>
              <div className={cx(classes["popup__button"], classes["close-popup"])} onClick={onClosePinValidation}>
                cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withNfcRedirection(withBarcodeReader(AccountSearchPage));
