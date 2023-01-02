import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import { useFormik } from "formik";
import isEmpty from "lodash.isempty";
import trim from "lodash.trim";
import { useEffect, useMemo, useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import "react-day-picker/lib/style.css";

import { Link } from "react-router-dom";

import {
  ACCOUNT_FIELD_ADDRESS,
  ACCOUNT_FIELD_CITY,
  ACCOUNT_FIELD_COUNTRY_CODE,
  ACCOUNT_FIELD_CURRENCY_CODE,
  ACCOUNT_FIELD_DATE_OF_BIRTH,
  ACCOUNT_FIELD_EMAIL,
  ACCOUNT_FIELD_FIRST_NAME,
  ACCOUNT_FIELD_GENDER,
  ACCOUNT_FIELD_IDENTITY_DOCUMENT,
  ACCOUNT_FIELD_LANGUAGE_CODE,
  ACCOUNT_FIELD_LAST_NAME,
  ACCOUNT_FIELD_MOBILE,
  ACCOUNT_FIELD_PASSWORD,
  ACCOUNT_FIELD_PASSWORD_CONFIRM,
  ACCOUNT_FIELD_PIN,
  ACCOUNT_FIELD_POSTCODE,
  ACCOUNT_FIELD_PRICE_FORMAT,
  ACCOUNT_FIELD_REFERRAL_METHOD,
  ACCOUNT_FIELD_SECURITY_ANSWER,
  ACCOUNT_FIELD_SECURITY_QUESTION,
  ACCOUNT_FIELD_USERNAME,
} from "../../../../../constants/account-fields";
import { ALERT_SUCCESS_ACCOUNT_CREATED } from "../../../../../constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_CREATE } from "../../../../../constants/exceptions-types";
import { useGetCurrencies } from "../../../../../hooks/currencies-hooks";
import { useGetSecurityQuestion } from "../../../../../hooks/security-questions-hooks";
import { getRetailTillDetails } from "../../../../../redux/reselect/retail-selector";
import { getCountries } from "../../../../../redux/slices/countrySlice";
import { createRetailPlayerAccount } from "../../../../../redux/slices/retailAccountSlice";
import { getAccountFields } from "../../../../../utils/account-profile";
import { getErrors, getInitialValues } from "../../../../../utils/account-profile/account-create";
import { getProfileFormValidation } from "../../../../../utils/account-profile/account-create-validation-schema";
import { useFocusOnError } from "../../../../../utils/account-profile/hooks";
import { alertError, getAlertErrorMessage } from "../../../../../utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "../../../../../utils/alert-success";
import { getMonths, getWeekdaysLong, getWeekdaysShort } from "../../../../../utils/day-picker-utils";
import Footer from "../../../components/Footer/components";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import withNfcRedirection from "../../../hocs/withNfcRedirection";
import LogoPNG from "../../../img/logo.png";
import { getAge } from "../../../utils/ageUtils";

import { useTranslation } from "react-i18next";

const DATE_FORMAT = "DD-MMM-YY";

const formatDate = (date) => dayjs(date).format(DATE_FORMAT);

const parseDate = (str) => {
  const parsed = dayjs(str, DATE_FORMAT, "en");
  if (!parsed.isValid()) {
    return new Date();
  }

  return parsed.toDate();
};

const fields = [
  ACCOUNT_FIELD_ADDRESS,
  ACCOUNT_FIELD_CITY,
  ACCOUNT_FIELD_COUNTRY_CODE,
  ACCOUNT_FIELD_CURRENCY_CODE,
  ACCOUNT_FIELD_DATE_OF_BIRTH,
  ACCOUNT_FIELD_EMAIL,
  ACCOUNT_FIELD_FIRST_NAME,
  ACCOUNT_FIELD_GENDER,
  ACCOUNT_FIELD_IDENTITY_DOCUMENT,
  ACCOUNT_FIELD_LANGUAGE_CODE,
  ACCOUNT_FIELD_LAST_NAME,
  ACCOUNT_FIELD_MOBILE,
  ACCOUNT_FIELD_PASSWORD,
  ACCOUNT_FIELD_PASSWORD_CONFIRM,
  ACCOUNT_FIELD_PIN,
  ACCOUNT_FIELD_POSTCODE,
  ACCOUNT_FIELD_PRICE_FORMAT,
  ACCOUNT_FIELD_REFERRAL_METHOD,
  ACCOUNT_FIELD_SECURITY_ANSWER,
  ACCOUNT_FIELD_SECURITY_QUESTION,
  ACCOUNT_FIELD_USERNAME,
];

const AccountCreatePage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const tillDetails = useSelector(getRetailTillDetails);
  const tillCurrencyCode = tillDetails?.currencyCode;
  const currencies = useGetCurrencies(dispatch);
  const countries = useSelector((state) => state.country?.countries);
  const securityQuestions = useGetSecurityQuestion(dispatch);

  useEffect(() => {
    if (isEmpty(countries)) {
      dispatch(getCountries());
    }
  }, []);

  const [apiErrors, setApiErrors] = useState([]);

  const profileValidationSchema = useMemo(() => getProfileFormValidation({ fields, t }), [fields]);

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    isValidating,
    setErrors,
    setFieldValue,
    setTouched,
    submitCount,
    touched,
    validateForm,
    values,
  } = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues({
      defaultCountry: "PH",
      defaultCurrency: tillCurrencyCode,
      defaultLanguage: "en",
      defaultPriceFormat: "EURO",
      fields: getAccountFields({
        fields,
        registrationMode: "USERNAME",
      }),
      referrals: [],
      securityQuestions,
    }),
    onSubmit: async (valuesSubmitted) => {
      validateForm(valuesSubmitted);
      // Do not create account if form is already submitted.
      if (isValidating && isSubmitting) {
        return;
      }
      const {
        [ACCOUNT_FIELD_ADDRESS]: address,
        [ACCOUNT_FIELD_CITY]: city,
        [ACCOUNT_FIELD_COUNTRY_CODE]: countryCode,
        [ACCOUNT_FIELD_DATE_OF_BIRTH]: dob,
        [ACCOUNT_FIELD_EMAIL]: email,
        [ACCOUNT_FIELD_FIRST_NAME]: firstName,
        [ACCOUNT_FIELD_GENDER]: sex,
        [ACCOUNT_FIELD_IDENTITY_DOCUMENT]: identityDocument,
        [ACCOUNT_FIELD_LANGUAGE_CODE]: languageCode,
        [ACCOUNT_FIELD_LAST_NAME]: lastName,
        [ACCOUNT_FIELD_MOBILE]: mobile,
        [ACCOUNT_FIELD_PASSWORD]: password,
        [ACCOUNT_FIELD_PIN]: pin,
        [ACCOUNT_FIELD_POSTCODE]: postcode,
        [ACCOUNT_FIELD_PRICE_FORMAT]: priceFormat,
        [ACCOUNT_FIELD_SECURITY_ANSWER]: securityAnswer,
        [ACCOUNT_FIELD_SECURITY_QUESTION]: securityQuestion,
        [ACCOUNT_FIELD_USERNAME]: username,
      } = valuesSubmitted;
      const resultAction = await dispatch(
        createRetailPlayerAccount({
          user: {
            address: trim(address),
            city: trim(city),
            countryCode,
            currencyCode: tillCurrencyCode,
            dob,
            email: trim(email),
            firstName: trim(firstName),
            identityDocument: trim(identityDocument),
            languageCode,
            lastName: trim(lastName),
            mobile,
            password: trim(password),
            pin,
            postcode: trim(postcode),
            priceFormat,
            securityQuestionAnswers: securityQuestion
              ? {
                  [securityQuestion]: trim(securityAnswer),
                }
              : undefined,
            sex,
            username: trim(username),
          },
        }),
      );
      if (createRetailPlayerAccount.fulfilled.match(resultAction)) {
        alertSuccess(getAlertSuccessMessage(ALERT_SUCCESS_ACCOUNT_CREATED, t));
        history.push("/");

        return;
      }
      if (resultAction.payload) {
        const errors = getErrors(resultAction.payload);
        if (Object.keys(errors).length !== 0) {
          setTouched(errors);
          setApiErrors(errors);

          return;
        }
      }
      alertError(getAlertErrorMessage(EXCEPTION_INVALID_PARAMS_ACCOUNT_CREATE, t));
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: profileValidationSchema,
  });
  useFocusOnError({
    errors,
    isValid,
    submitCount,
  });

  return (
    <div className={classes["slipstream-body"]}>
      <div className={classes["wrapper"]}>
        <header className={classes["header"]}>
          <div className={classes["header__container"]}>
            <div className={classes["header__logo"]} onClick={() => history.push("/")}>
              <img alt="" src={LogoPNG} />
            </div>

            <div className={classes["header__links"]}>
              <Link className={cx(classes["header__link"], classes["link"])} to="/accountsearch">
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
            <form onSubmit={handleSubmit}>
              <div className={classes["account-changes"]}>
                <div className={classes["account-changes__title"]}>Create new account</div>

                <div className={classes["account-changes__container"]}>
                  <div className={cx(classes["account-changes__item"], classes["account-changes-item"])}>
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Gender</div>
                      <div className={classes["account-changes-item__data"]}>
                        <select
                          id={ACCOUNT_FIELD_GENDER}
                          value={values[ACCOUNT_FIELD_GENDER]}
                          onChange={(e) => setFieldValue(ACCOUNT_FIELD_GENDER, e.target.value)}
                        >
                          <option value="M">Mr</option>
                          <option value="F">Ms</option>
                        </select>
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_GENDER] &&
                      (errors[ACCOUNT_FIELD_GENDER] || apiErrors[ACCOUNT_FIELD_GENDER]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_GENDER] &&
                            (errors[ACCOUNT_FIELD_GENDER] || apiErrors[ACCOUNT_FIELD_GENDER])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>First Name</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_FIRST_NAME}
                          type="text"
                          value={values[ACCOUNT_FIELD_FIRST_NAME]}
                          onBlur={handleBlur}
                          onChange={handleChange(ACCOUNT_FIELD_FIRST_NAME)}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_FIRST_NAME] &&
                      (errors[ACCOUNT_FIELD_FIRST_NAME] || apiErrors[ACCOUNT_FIELD_FIRST_NAME]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_FIRST_NAME] &&
                            (errors[ACCOUNT_FIELD_FIRST_NAME] || apiErrors[ACCOUNT_FIELD_FIRST_NAME])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Middle Name</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input type="text" />
                      </div>
                    </div>
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Last Name</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_LAST_NAME}
                          type="text"
                          value={values[ACCOUNT_FIELD_LAST_NAME]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_LAST_NAME] &&
                      (errors[ACCOUNT_FIELD_LAST_NAME] || apiErrors[ACCOUNT_FIELD_LAST_NAME]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_LAST_NAME] &&
                            (errors[ACCOUNT_FIELD_LAST_NAME] || apiErrors[ACCOUNT_FIELD_LAST_NAME])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Country</div>
                      <div className={classes["account-changes-item__data"]}>
                        <select
                          id={ACCOUNT_FIELD_COUNTRY_CODE}
                          name={ACCOUNT_FIELD_COUNTRY_CODE}
                          value={values[ACCOUNT_FIELD_COUNTRY_CODE]}
                          onChange={(e) => setFieldValue(ACCOUNT_FIELD_COUNTRY_CODE, e.target.value)}
                        >
                          {countries?.map((country) => (
                            <option key={country.isoCode2} value={country.isoCode2}>
                              {country.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_COUNTRY_CODE] &&
                      (errors[ACCOUNT_FIELD_COUNTRY_CODE] || apiErrors[ACCOUNT_FIELD_COUNTRY_CODE]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_COUNTRY_CODE] &&
                            (errors[ACCOUNT_FIELD_COUNTRY_CODE] || apiErrors[ACCOUNT_FIELD_COUNTRY_CODE])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Date of Birth (MM/DD/YYYY)</div>
                      <div
                        className={cx(
                          classes["account-changes-item__data"],
                          classes["account-changes-item__data_birth"],
                        )}
                      >
                        <DayPickerInput
                          dayPickerProps={{
                            disabledDays: {
                              after: dayjs(new Date()).subtract(18, "year").toDate(),
                            },
                            firstDayOfWeek: 1,
                            months: getMonths("en"),
                            weekdaysLong: getWeekdaysLong("en"),
                            weekdaysShort: getWeekdaysShort("en"),
                          }}
                          formatDate={formatDate}
                          parseDate={parseDate}
                          placeholder={t("forms.birth_date")}
                          style={{ display: "block" }}
                          value={formatDate(values[ACCOUNT_FIELD_DATE_OF_BIRTH])}
                          onDayChange={(day) => setFieldValue(ACCOUNT_FIELD_DATE_OF_BIRTH, day)}
                        />
                        <div className={classes["account-changes-item__age"]}>
                          {`Age: ${getAge(values[ACCOUNT_FIELD_DATE_OF_BIRTH])}`}
                        </div>
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_DATE_OF_BIRTH] &&
                      (errors[ACCOUNT_FIELD_DATE_OF_BIRTH] || apiErrors[ACCOUNT_FIELD_DATE_OF_BIRTH]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_DATE_OF_BIRTH] &&
                            (errors[ACCOUNT_FIELD_DATE_OF_BIRTH] || apiErrors[ACCOUNT_FIELD_DATE_OF_BIRTH])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Address</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_ADDRESS}
                          type="text"
                          value={values[ACCOUNT_FIELD_ADDRESS]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_ADDRESS] &&
                      (errors[ACCOUNT_FIELD_ADDRESS] || apiErrors[ACCOUNT_FIELD_ADDRESS]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_ADDRESS] &&
                            (errors[ACCOUNT_FIELD_ADDRESS] || apiErrors[ACCOUNT_FIELD_ADDRESS])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Postcode</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_POSTCODE}
                          type="text"
                          value={values[ACCOUNT_FIELD_POSTCODE]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  {touched[ACCOUNT_FIELD_POSTCODE] &&
                    (errors[ACCOUNT_FIELD_POSTCODE] || apiErrors[ACCOUNT_FIELD_POSTCODE]) && (
                      <div className={classes["account-changes-item__error"]}>
                        {touched[ACCOUNT_FIELD_POSTCODE] &&
                          (errors[ACCOUNT_FIELD_POSTCODE] || apiErrors[ACCOUNT_FIELD_POSTCODE])}
                      </div>
                    )}
                  <div className={cx(classes["account-changes__item"], classes["account-changes-item"])}>
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Username</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_USERNAME}
                          type="text"
                          value={values[ACCOUNT_FIELD_USERNAME]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_USERNAME] &&
                      (errors[ACCOUNT_FIELD_USERNAME] || apiErrors[ACCOUNT_FIELD_USERNAME]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_USERNAME] &&
                            (errors[ACCOUNT_FIELD_USERNAME] || apiErrors[ACCOUNT_FIELD_USERNAME])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Email Address</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_EMAIL}
                          type="email"
                          value={values[ACCOUNT_FIELD_EMAIL]}
                          onBlur={handleBlur}
                          onChange={handleChange(ACCOUNT_FIELD_EMAIL)}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_EMAIL] &&
                      (errors[ACCOUNT_FIELD_EMAIL] || apiErrors[ACCOUNT_FIELD_EMAIL]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_EMAIL] &&
                            (errors[ACCOUNT_FIELD_EMAIL] || apiErrors[ACCOUNT_FIELD_EMAIL])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Mobile Number</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_MOBILE}
                          type="text"
                          value={values[ACCOUNT_FIELD_MOBILE]}
                          onBlur={handleBlur}
                          onChange={handleChange(ACCOUNT_FIELD_MOBILE)}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_MOBILE] &&
                      (errors[ACCOUNT_FIELD_MOBILE] || apiErrors[ACCOUNT_FIELD_MOBILE]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_MOBILE] &&
                            (errors[ACCOUNT_FIELD_MOBILE] || apiErrors[ACCOUNT_FIELD_MOBILE])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Password</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_PASSWORD}
                          type="password"
                          value={values[ACCOUNT_FIELD_PASSWORD]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_PASSWORD] &&
                      (errors[ACCOUNT_FIELD_PASSWORD] || apiErrors[ACCOUNT_FIELD_PASSWORD]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_PASSWORD] &&
                            (errors[ACCOUNT_FIELD_PASSWORD] || apiErrors[ACCOUNT_FIELD_PASSWORD])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Confirm Password</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_PASSWORD_CONFIRM}
                          type="password"
                          value={values[ACCOUNT_FIELD_PASSWORD_CONFIRM]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_PASSWORD_CONFIRM] &&
                      (errors[ACCOUNT_FIELD_PASSWORD_CONFIRM] || apiErrors[ACCOUNT_FIELD_PASSWORD_CONFIRM]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_PASSWORD_CONFIRM] &&
                            (errors[ACCOUNT_FIELD_PASSWORD_CONFIRM] || apiErrors[ACCOUNT_FIELD_PASSWORD_CONFIRM])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Pin</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_PIN}
                          type="number"
                          value={values[ACCOUNT_FIELD_PIN]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_PIN] && (errors[ACCOUNT_FIELD_PIN] || apiErrors[ACCOUNT_FIELD_PIN]) && (
                      <div className={classes["account-changes-item__error"]}>
                        {touched[ACCOUNT_FIELD_PIN] && (errors[ACCOUNT_FIELD_PIN] || apiErrors[ACCOUNT_FIELD_PIN])}
                      </div>
                    )}
                    {/* <div className={classes["account-changes-item__box"]}> */}
                    {/*  <div className={classes["account-changes-item__label"]}>ID Type</div> */}
                    {/*  <div className={classes["account-changes-item__data"]}> */}
                    {/*    <select id="idType" name="idType"> */}
                    {/*      <option disabled className={classes["default"]}> */}
                    {/*        Select type of ID */}
                    {/*      </option> */}
                    {/*      <option value="2">Alien/Immigrant Certificate of Registration</option> */}
                    {/*      <option value="0">Driver's License</option> */}
                    {/*      <option value="14">Firearms License issued by PNP</option> */}
                    {/*      <option value="15">Integrated Bar of the Philippines ID</option> */}
                    {/*      <option value="16">National Bureau of Investigation (NBI) Clearance</option> */}
                    {/*      <option value="17">Overseas Filipino Worker (OFW) ID</option> */}
                    {/*      <option value="18">Overseas Workers Welfare Administration (OWWA) ID</option> */}
                    {/*      <option value="3">Passport including foreign issued</option> */}
                    {/*      <option value="19">PhilHealth ID</option> */}
                    {/*      <option value="20">Police Clearance Certificate</option> */}
                    {/*      <option value="4">Postal ID</option> */}
                    {/*      <option value="5">Professional Regulations Commission (PRC) ID</option> */}
                    {/*      <option value="21">Seaman's Book</option> */}
                    {/*      <option value="6">Senior Citizen Card</option> */}
                    {/*      <option value="7">Social Security System (SSS) Card</option> */}
                    {/*      <option value="8">Tax Identification (TIN)</option> */}
                    {/*      <option value="9">Unified Multi-Purpose ID (UMID)</option> */}
                    {/*      <option value="10">Voter's ID</option> */}
                    {/*    </select> */}
                    {/*  </div> */}
                    {/* </div> */}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>ID Number</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_IDENTITY_DOCUMENT}
                          type="text"
                          value={values[ACCOUNT_FIELD_IDENTITY_DOCUMENT]}
                          onBlur={handleBlur}
                          onChange={(event) => {
                            setFieldValue(ACCOUNT_FIELD_IDENTITY_DOCUMENT, event.target.value.toUpperCase());
                          }}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_IDENTITY_DOCUMENT] &&
                      (errors[ACCOUNT_FIELD_IDENTITY_DOCUMENT] || apiErrors[ACCOUNT_FIELD_IDENTITY_DOCUMENT]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_IDENTITY_DOCUMENT] &&
                            (errors[ACCOUNT_FIELD_IDENTITY_DOCUMENT] || apiErrors[ACCOUNT_FIELD_IDENTITY_DOCUMENT])}
                        </div>
                      )}
                    {/* <div className={classes["account-changes-item__box"]}> */}
                    {/*  <div className={classes["account-changes-item__label"]}>ID Type 2</div> */}
                    {/*  <div className={classes["account-changes-item__data"]}> */}
                    {/*    <select id="idType2" name="idType2"> */}
                    {/*      <option className={classes["default"]} disabled="disabled" value=""> */}
                    {/*        Select type of ID */}
                    {/*      </option> */}
                    {/*      <option value="2">Alien/Immigrant Certificate of Registration</option> */}
                    {/*      <option value="0">Driver's License</option> */}
                    {/*      <option value="14">Firearms License issued by PNP</option> */}
                    {/*      <option value="15">Integrated Bar of the Philippines ID</option> */}
                    {/*      <option value="16">National Bureau of Investigation (NBI) Clearance</option> */}
                    {/*      <option value="17">Overseas Filipino Worker (OFW) ID</option> */}
                    {/*      <option value="18">Overseas Workers Welfare Administration (OWWA) ID</option> */}
                    {/*      <option value="3">Passport including foreign issued</option> */}
                    {/*      <option value="19">PhilHealth ID</option> */}
                    {/*      <option value="20">Police Clearance Certificate</option> */}
                    {/*      <option value="4">Postal ID</option> */}
                    {/*      <option value="5">Professional Regulations Commission (PRC) ID</option> */}
                    {/*      <option value="21">Seaman's Book</option> */}
                    {/*      <option value="6">Senior Citizen Card</option> */}
                    {/*      <option value="7">Social Security System (SSS) Card</option> */}
                    {/*      <option value="8">Tax Identification (TIN)</option> */}
                    {/*      <option value="9">Unified Multi-Purpose ID (UMID)</option> */}
                    {/*      <option value="10">Voter's ID</option> */}
                    {/*    </select> */}
                    {/*  </div> */}
                    {/* </div> */}
                    {/* <div className={classes["account-changes-item__box"]}> */}
                    {/*  <div className={classes["account-changes-item__label"]}>ID Number 2</div> */}
                    {/*  <div className={classes["account-changes-item__data"]}> */}
                    {/*    <input type="text" /> */}
                    {/*  </div> */}
                    {/* </div> */}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Security Question 1</div>
                      <div className={classes["account-changes-item__data"]}>
                        <select
                          className={classes["securityquestion-group"]}
                          id={ACCOUNT_FIELD_SECURITY_QUESTION}
                          value={values[ACCOUNT_FIELD_SECURITY_QUESTION]}
                          onChange={(e) => setFieldValue(ACCOUNT_FIELD_SECURITY_QUESTION, e.target.value)}
                        >
                          {securityQuestions?.map((question) => (
                            <option key={question.key} value={question.key}>
                              {question.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_SECURITY_QUESTION] &&
                      (errors[ACCOUNT_FIELD_SECURITY_QUESTION] || apiErrors[ACCOUNT_FIELD_SECURITY_QUESTION]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_SECURITY_QUESTION] &&
                            (errors[ACCOUNT_FIELD_SECURITY_QUESTION] || apiErrors[ACCOUNT_FIELD_SECURITY_QUESTION])}
                        </div>
                      )}
                    <div className={classes["account-changes-item__box"]}>
                      <div className={classes["account-changes-item__label"]}>Security Answer 1</div>
                      <div className={classes["account-changes-item__data"]}>
                        <input
                          id={ACCOUNT_FIELD_SECURITY_ANSWER}
                          type="password"
                          value={values[ACCOUNT_FIELD_SECURITY_ANSWER]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {touched[ACCOUNT_FIELD_SECURITY_ANSWER] &&
                      (errors[ACCOUNT_FIELD_SECURITY_ANSWER] || apiErrors[ACCOUNT_FIELD_SECURITY_ANSWER]) && (
                        <div className={classes["account-changes-item__error"]}>
                          {touched[ACCOUNT_FIELD_SECURITY_ANSWER] &&
                            (errors[ACCOUNT_FIELD_SECURITY_ANSWER] || apiErrors[ACCOUNT_FIELD_SECURITY_ANSWER])}
                        </div>
                      )}
                    {/* <div className={classes["account-changes-item__box"]}> */}
                    {/*  <div className={classes["account-changes-item__label"]}>Security Question 2</div> */}
                    {/*  <div className={classes["account-changes-item__data"]}> */}
                    {/*    <select */}
                    {/*      className={classes["securityquestion-group"]} */}
                    {/*      id="securityQuestionId2" */}
                    {/*      name="securityQuestionId2" */}
                    {/*      value={securityQuestion} */}
                    {/*      onChange={(e) => setSecurityQuestion(e.target.value)} */}
                    {/*    > */}
                    {/*      {securityQuestions?.map((question) => { */}
                    {/*        <option key={question.id} value={question.id}> */}
                    {/*          {question.description} */}
                    {/*        </option>; */}
                    {/*      })} */}
                    {/*    </select> */}
                    {/*  </div> */}
                    {/* </div> */}
                    {/* <div className={classes["account-changes-item__box"]}> */}
                    {/*  <div className={classes["account-changes-item__label"]}>Security Answer 2</div> */}
                    {/*  <div className={classes["account-changes-item__data"]}> */}
                    {/*    <input type="password" /> */}
                    {/*  </div> */}
                    {/* </div> */}
                    {/* <div className={classes["account-changes-item__box"]}> */}
                    {/*  <div className={classes["account-changes-item__label"]}>How did you know about MSW?</div> */}
                    {/*  <div className={classes["account-changes-item__data"]}> */}
                    {/*    <select id="referralMethodId" name="referralMethodId" value=""> */}
                    {/*      <option value="">None</option> */}
                    {/*      <option value="14">Referred by Friend</option> */}
                    {/*      <option value="15">Website</option> */}
                    {/*      <option value="16">Facebook</option> */}
                    {/*      <option value="17">Twitter</option> */}
                    {/*      <option value="18">WeLoveSport.com</option> */}
                    {/*      <option value="19">Event</option> */}
                    {/*      <option value="20">Others</option> */}
                    {/*    </select> */}
                    {/*  </div> */}
                    {/* </div> */}
                  </div>
                </div>
                <div className={classes["account-changes__buttons"]}>
                  <div className={classes["account-changes__button"]} onClick={() => history.push("/accountsearch")}>
                    Cancel
                  </div>
                  <button
                    className={cx(classes["account-changes__button"], {
                      [classes["disabled"]]: isSubmitting,
                    })}
                    type="submit"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default withNfcRedirection(withBarcodeReader(AccountCreatePage));
