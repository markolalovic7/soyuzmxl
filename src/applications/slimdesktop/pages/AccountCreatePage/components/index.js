import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import { useFormik } from "formik";
import trim from "lodash.trim";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

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
import { ACCOUNT_REGISTRATION_GENDER_ITEMS } from "../../../../../constants/account-registration-gender-items";
import { ALERT_SUCCESS_ACCOUNT_CREATED } from "../../../../../constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_CREATE } from "../../../../../constants/exceptions-types";
import { PHONE_NUMBER_COUNTRY_CODES } from "../../../../../constants/phone-numbers";
import { useGetCountries } from "../../../../../hooks/countries-hooks";
import { useGetCurrencies } from "../../../../../hooks/currencies-hooks";
import { useGetLanguages } from "../../../../../hooks/languages-hooks";
import { useGetReferrals } from "../../../../../hooks/referrals-hooks";
import { useGetSecurityQuestion } from "../../../../../hooks/security-questions-hooks";
import {
  getCmsConfigAccounts,
  getCmsConfigBetting,
  getCmsConfigBrandDetails,
  getCmsConfigIsLoading,
} from "../../../../../redux/reselect/cms-selector";
import { createAccount } from "../../../../../redux/slices/accountSlice";
import { getAccountFields } from "../../../../../utils/account-profile";
import { getErrors, getInitialValues } from "../../../../../utils/account-profile/account-create";
import { getProfileFormValidation } from "../../../../../utils/account-profile/account-create-validation-schema";
import { useFocusOnError } from "../../../../../utils/account-profile/hooks";
import { alertError, getAlertErrorMessage } from "../../../../../utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "../../../../../utils/alert-success";
import { getDateObjectNowSubtract18Years } from "../../../../../utils/dayjs";
import { isDefined } from "../../../../../utils/lodash";
import { getDateParsed } from "../../../../../utils/ui-labels";
import CheckboxField from "../../../components/FormFields/CheckboxField";
import DatePickerField from "../../../components/FormFields/DatePickerField";
import InputField from "../../../components/FormFields/InputField";
import SelectField from "../../../components/FormFields/SelectField";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AccountCreatePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [apiErrors, setApiErrors] = useState([]);
  const [termsAndConditionsChecked, setTermsAndConditionsChecked] = useState(false);
  const [ageConfirmationChecked, setAgeConfirmationChecked] = useState(false);

  const countries = useGetCountries(dispatch);
  const currencies = useGetCurrencies(dispatch);
  const referrals = useGetReferrals(dispatch);
  const securityQuestions = useGetSecurityQuestion(dispatch);
  const languages = useGetLanguages(dispatch);

  const cmsConfigIsLoading = useSelector(getCmsConfigIsLoading);
  const cmsConfigAccounts = useSelector(getCmsConfigAccounts);
  const {
    data: { fields, registrationMode },
  } = cmsConfigAccounts || { data: {} };

  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);
  const {
    data: { defaultCountry, defaultCurrency, defaultLanguage },
  } = cmsConfigBrandDetails || { data: {} };

  const cmsConfigBetting = useSelector(getCmsConfigBetting);
  const {
    data: { defaultPriceFormat, priceFormats },
  } = cmsConfigBetting || { data: {} };

  const accountFields = getAccountFields({ fields, registrationMode });

  const profileValidationSchema = useMemo(() => getProfileFormValidation({ fields, t }), [fields]);
  const priceFormatsItems = useMemo(
    () =>
      priceFormats.map((item) => ({
        key: item,
        label: t(`price_formats.${item}`),
        value: item,
      })),
    [priceFormats, t],
  );
  const genderItems = ACCOUNT_REGISTRATION_GENDER_ITEMS.map((item) => ({
    ...item,
    label: t(item.label),
  }));
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
      defaultCountry,
      defaultCurrency,
      defaultLanguage,
      defaultPriceFormat,
      fields,
      referrals,
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
        [ACCOUNT_FIELD_CURRENCY_CODE]: currencyCode,
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
        [ACCOUNT_FIELD_REFERRAL_METHOD]: referralMethodId,
        [ACCOUNT_FIELD_SECURITY_ANSWER]: securityAnswer,
        [ACCOUNT_FIELD_SECURITY_QUESTION]: securityQuestion,
        [ACCOUNT_FIELD_USERNAME]: username,
      } = valuesSubmitted;
      const resultAction = await dispatch(
        createAccount({
          user: {
            address: trim(address),
            city: trim(city),
            countryCode,
            currencyCode,
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
            referralMethodId: Number(referralMethodId),
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
      if (createAccount.fulfilled.match(resultAction)) {
        alertSuccess(getAlertSuccessMessage(ALERT_SUCCESS_ACCOUNT_CREATED, t));

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

  if (cmsConfigIsLoading) {
    return <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />;
  }

  return (
    <main className={classes["main"]}>
      <section className={cx(classes["content"], classes["content_form"])}>
        <form action="#" className={classes["rf"]} onSubmit={handleSubmit}>
          <div className={classes["form"]}>
            <div className={classes["form__header"]}>
              <span className={classes["form__title"]}>{t("create_account")}</span>
            </div>
            <div className={classes["form__body"]}>
              <div className={classes["form__label"]}>
                <i>*</i>
                {` - ${t("vanilladesktop.fields_asterisk")}`}
              </div>
              <div className={classes["form__content"]}>
                <div className={classes["form__container"]}>
                  <div className={classes["inputs-box"]}>
                    <div className={classes["inputs-box__header"]}>
                      <span className={classes["inputs-box__title"]}>{t("personal_details")}</span>
                    </div>
                    <div className={classes["inputs-box__body"]}>
                      <div className={classes["inputs-box__row"]}>
                        {isDefined(fields[ACCOUNT_FIELD_FIRST_NAME]) && (
                          <InputField
                            disabled={isSubmitting}
                            id={ACCOUNT_FIELD_FIRST_NAME}
                            label={t("forms.first_name")}
                            name={ACCOUNT_FIELD_FIRST_NAME}
                            placeholder={t("forms.first_name")}
                            required={fields[ACCOUNT_FIELD_FIRST_NAME]}
                            textError={
                              touched[ACCOUNT_FIELD_FIRST_NAME] &&
                              (errors[ACCOUNT_FIELD_FIRST_NAME] || apiErrors[ACCOUNT_FIELD_FIRST_NAME])
                            }
                            type="text"
                            value={values[ACCOUNT_FIELD_FIRST_NAME]}
                            onBlur={handleBlur}
                            onChange={handleChange(ACCOUNT_FIELD_FIRST_NAME)}
                          />
                        )}
                        {isDefined(fields[ACCOUNT_FIELD_LAST_NAME]) && (
                          <InputField
                            disabled={isSubmitting}
                            id={ACCOUNT_FIELD_LAST_NAME}
                            label={t("forms.last_name")}
                            name={ACCOUNT_FIELD_LAST_NAME}
                            placeholder={t("forms.last_name")}
                            required={fields[ACCOUNT_FIELD_LAST_NAME]}
                            textError={
                              touched[ACCOUNT_FIELD_LAST_NAME] &&
                              (errors[ACCOUNT_FIELD_LAST_NAME] || apiErrors[ACCOUNT_FIELD_LAST_NAME])
                            }
                            type="text"
                            value={values[ACCOUNT_FIELD_LAST_NAME]}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                      <div className={classes["inputs-box__row"]}>
                        {isDefined(fields[ACCOUNT_FIELD_DATE_OF_BIRTH]) && (
                          <DatePickerField
                            date={values[ACCOUNT_FIELD_DATE_OF_BIRTH]}
                            id={ACCOUNT_FIELD_DATE_OF_BIRTH}
                            label={t("forms.birth_date")}
                            maxDate={getDateParsed(getDateObjectNowSubtract18Years())}
                            name={ACCOUNT_FIELD_DATE_OF_BIRTH}
                            required={fields[ACCOUNT_FIELD_DATE_OF_BIRTH]}
                            textError={
                              touched[ACCOUNT_FIELD_DATE_OF_BIRTH] &&
                              (errors[ACCOUNT_FIELD_DATE_OF_BIRTH] || apiErrors[ACCOUNT_FIELD_DATE_OF_BIRTH])
                            }
                            type="date"
                            onChange={setFieldValue}
                          />
                        )}
                        {isDefined(fields[ACCOUNT_FIELD_GENDER]) && (
                          <SelectField
                            label={t("forms.sex")}
                            name={ACCOUNT_FIELD_GENDER}
                            options={genderItems}
                            required={fields[ACCOUNT_FIELD_GENDER]}
                            value={values[ACCOUNT_FIELD_GENDER]}
                            onSetFieldValue={setFieldValue}
                          />
                        )}
                        {isDefined(fields[ACCOUNT_FIELD_ADDRESS]) && (
                          <InputField
                            disabled={isSubmitting}
                            id={ACCOUNT_FIELD_ADDRESS}
                            label={t("forms.address")}
                            name={ACCOUNT_FIELD_ADDRESS}
                            placeholder={t("forms.address")}
                            required={fields[ACCOUNT_FIELD_ADDRESS]}
                            textError={
                              touched[ACCOUNT_FIELD_ADDRESS] &&
                              (errors[ACCOUNT_FIELD_ADDRESS] || apiErrors[ACCOUNT_FIELD_ADDRESS])
                            }
                            type="text"
                            value={values[ACCOUNT_FIELD_ADDRESS]}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                      <div className={classes["inputs-box__row"]}>
                        {isDefined(fields[ACCOUNT_FIELD_POSTCODE]) && (
                          <InputField
                            disabled={isSubmitting}
                            id={ACCOUNT_FIELD_POSTCODE}
                            label={t("forms.postcode")}
                            name={ACCOUNT_FIELD_POSTCODE}
                            placeholder={t("forms.postcode_placeholder")}
                            required={fields[ACCOUNT_FIELD_POSTCODE]}
                            textError={
                              touched[ACCOUNT_FIELD_POSTCODE] &&
                              (errors[ACCOUNT_FIELD_POSTCODE] || apiErrors[ACCOUNT_FIELD_POSTCODE])
                            }
                            type="text"
                            value={values[ACCOUNT_FIELD_POSTCODE]}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        )}
                        {isDefined(fields[ACCOUNT_FIELD_CITY]) && (
                          <InputField
                            disabled={isSubmitting}
                            id={ACCOUNT_FIELD_CITY}
                            label={t("forms.city")}
                            name={ACCOUNT_FIELD_CITY}
                            placeholder={t("forms.city")}
                            required={fields[ACCOUNT_FIELD_CITY]}
                            textError={
                              touched[ACCOUNT_FIELD_CITY] &&
                              (errors[ACCOUNT_FIELD_CITY] || apiErrors[ACCOUNT_FIELD_CITY])
                            }
                            type="text"
                            value={values[ACCOUNT_FIELD_CITY]}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                      <div className={classes["inputs-box__row"]}>
                        {isDefined(fields[ACCOUNT_FIELD_COUNTRY_CODE]) && (
                          <SelectField
                            label={t("forms.country")}
                            name={ACCOUNT_FIELD_COUNTRY_CODE}
                            options={countries}
                            required={fields[ACCOUNT_FIELD_COUNTRY_CODE]}
                            value={values[ACCOUNT_FIELD_COUNTRY_CODE]}
                            onSetFieldValue={(name, value) => {
                              setFieldValue(name, value);
                              setFieldValue(
                                ACCOUNT_FIELD_MOBILE,
                                `${PHONE_NUMBER_COUNTRY_CODES[value]}${
                                  values[ACCOUNT_FIELD_MOBILE].split(
                                    PHONE_NUMBER_COUNTRY_CODES[values[ACCOUNT_FIELD_COUNTRY_CODE]],
                                  )[1] ?? ""
                                }`,
                              );
                            }}
                          />
                        )}
                        {isDefined(fields[ACCOUNT_FIELD_MOBILE]) && (
                          <InputField
                            disabled={isSubmitting}
                            id={ACCOUNT_FIELD_MOBILE}
                            label={t("forms.mobile_number")}
                            name={ACCOUNT_FIELD_MOBILE}
                            required={fields[ACCOUNT_FIELD_MOBILE]}
                            textError={
                              touched[ACCOUNT_FIELD_MOBILE] &&
                              (errors[ACCOUNT_FIELD_MOBILE] || apiErrors[ACCOUNT_FIELD_MOBILE])
                            }
                            type="text"
                            value={values[ACCOUNT_FIELD_MOBILE]}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                      <div className={classes["inputs-box__row"]}>
                        {isDefined(fields[ACCOUNT_FIELD_CURRENCY_CODE]) && (
                          <SelectField
                            label={t("forms.currency")}
                            name={ACCOUNT_FIELD_CURRENCY_CODE}
                            options={currencies}
                            required={fields[ACCOUNT_FIELD_CURRENCY_CODE]}
                            value={values[ACCOUNT_FIELD_CURRENCY_CODE]}
                            onSetFieldValue={setFieldValue}
                          />
                        )}
                        {isDefined(fields[ACCOUNT_FIELD_LANGUAGE_CODE]) && (
                          <SelectField
                            label={t("forms.language")}
                            name={ACCOUNT_FIELD_LANGUAGE_CODE}
                            options={languages}
                            required={fields[ACCOUNT_FIELD_LANGUAGE_CODE]}
                            value={values[ACCOUNT_FIELD_LANGUAGE_CODE]}
                            onSetFieldValue={setFieldValue}
                          />
                        )}
                        {isDefined(fields[ACCOUNT_FIELD_PRICE_FORMAT]) && (
                          <SelectField
                            label={t("forms.price_format")}
                            name={ACCOUNT_FIELD_PRICE_FORMAT}
                            options={priceFormatsItems}
                            required={fields[ACCOUNT_FIELD_PRICE_FORMAT]}
                            value={values[ACCOUNT_FIELD_PRICE_FORMAT]}
                            onSetFieldValue={setFieldValue}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={classes["form__checkboxes"]}>
                    <CheckboxField
                      required
                      checked={termsAndConditionsChecked}
                      id="registration__checkbox1"
                      label={t("vanilladesktop.tick_terms")}
                      name="registration__checkbox"
                      onChecked={setTermsAndConditionsChecked}
                    />
                  </div>
                </div>
                <div className={classes["form__container"]}>
                  <div className={classes["inputs-box"]}>
                    <div className={classes["inputs-box__header"]}>
                      <span className={classes["inputs-box__title"]}>{t("forms.account_details")}</span>
                    </div>
                    <div className={classes["inputs-box__body"]}>
                      <div className={classes["inputs-box__row"]}>
                        {isDefined(fields[ACCOUNT_FIELD_EMAIL]) && (
                          <InputField
                            disabled={isSubmitting}
                            id={ACCOUNT_FIELD_EMAIL}
                            label={t("forms.email")}
                            name={ACCOUNT_FIELD_EMAIL}
                            placeholder={t("forms.email")}
                            required={fields[ACCOUNT_FIELD_EMAIL]}
                            textError={
                              touched[ACCOUNT_FIELD_EMAIL] &&
                              (errors[ACCOUNT_FIELD_EMAIL] || apiErrors[ACCOUNT_FIELD_EMAIL])
                            }
                            type="text"
                            value={values[ACCOUNT_FIELD_EMAIL]}
                            onBlur={handleBlur}
                            onChange={handleChange(ACCOUNT_FIELD_EMAIL)}
                          />
                        )}
                        {isDefined(fields[ACCOUNT_FIELD_USERNAME]) && (
                          <InputField
                            disabled={isSubmitting}
                            id={ACCOUNT_FIELD_USERNAME}
                            label={t("forms.username")}
                            name={ACCOUNT_FIELD_USERNAME}
                            placeholder={t("forms.username")}
                            required={fields[ACCOUNT_FIELD_USERNAME]}
                            textError={
                              touched[ACCOUNT_FIELD_USERNAME] &&
                              (errors[ACCOUNT_FIELD_USERNAME] || apiErrors[ACCOUNT_FIELD_USERNAME])
                            }
                            type="text"
                            value={values[ACCOUNT_FIELD_USERNAME]}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                      <div className={classes["inputs-box__row"]}>
                        <InputField
                          required
                          disabled={isSubmitting}
                          id={ACCOUNT_FIELD_PASSWORD}
                          label={t("forms.password")}
                          name={ACCOUNT_FIELD_PASSWORD}
                          textError={
                            touched[ACCOUNT_FIELD_PASSWORD] &&
                            (errors[ACCOUNT_FIELD_PASSWORD] || apiErrors[ACCOUNT_FIELD_PASSWORD])
                          }
                          type="password"
                          value={values[ACCOUNT_FIELD_PASSWORD]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={classes["inputs-box__row"]}>
                        <InputField
                          required
                          disabled={isSubmitting}
                          id={ACCOUNT_FIELD_PASSWORD_CONFIRM}
                          label={t("forms.confirm_password")}
                          name={ACCOUNT_FIELD_PASSWORD_CONFIRM}
                          textError={
                            touched[ACCOUNT_FIELD_PASSWORD_CONFIRM] &&
                            (errors[ACCOUNT_FIELD_PASSWORD_CONFIRM] || apiErrors[ACCOUNT_FIELD_PASSWORD_CONFIRM])
                          }
                          type="password"
                          value={values[ACCOUNT_FIELD_PASSWORD_CONFIRM]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={classes["inputs-box__row"]}>
                        {isDefined(fields[ACCOUNT_FIELD_PIN]) && (
                          <InputField
                            disabled={isSubmitting}
                            id={ACCOUNT_FIELD_PIN}
                            label={t("forms.pin_code")}
                            name={ACCOUNT_FIELD_PIN}
                            required={fields[ACCOUNT_FIELD_PIN]}
                            textError={
                              touched[ACCOUNT_FIELD_PIN] && (errors[ACCOUNT_FIELD_PIN] || apiErrors[ACCOUNT_FIELD_PIN])
                            }
                            type="password"
                            value={values[ACCOUNT_FIELD_PIN]}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        )}
                        {isDefined(fields[ACCOUNT_FIELD_IDENTITY_DOCUMENT]) && (
                          <InputField
                            disabled={isSubmitting}
                            id={ACCOUNT_FIELD_IDENTITY_DOCUMENT}
                            label={t("forms.id_card_number")}
                            name={ACCOUNT_FIELD_IDENTITY_DOCUMENT}
                            placeholder={t("forms.id_card_number_placeholder")}
                            required={fields[ACCOUNT_FIELD_IDENTITY_DOCUMENT]}
                            textError={
                              touched[ACCOUNT_FIELD_IDENTITY_DOCUMENT] &&
                              (errors[ACCOUNT_FIELD_IDENTITY_DOCUMENT] || apiErrors[ACCOUNT_FIELD_IDENTITY_DOCUMENT])
                            }
                            type="text"
                            value={values[ACCOUNT_FIELD_IDENTITY_DOCUMENT]}
                            onBlur={handleBlur}
                            onChange={(event) => {
                              setFieldValue(ACCOUNT_FIELD_IDENTITY_DOCUMENT, event.target.value.toUpperCase());
                            }}
                          />
                        )}
                        {isDefined(fields[ACCOUNT_FIELD_REFERRAL_METHOD]) && (
                          <SelectField
                            isRequired={fields[ACCOUNT_FIELD_REFERRAL_METHOD]}
                            label={t("forms.referral")}
                            name={ACCOUNT_FIELD_REFERRAL_METHOD}
                            options={referrals}
                            value={values[ACCOUNT_FIELD_REFERRAL_METHOD]}
                            onSetFieldValue={setFieldValue}
                          />
                        )}
                      </div>
                      <div className={classes["inputs-box__row"]}>
                        {isDefined(fields[ACCOUNT_FIELD_SECURITY_QUESTION]) && (
                          <>
                            <SelectField
                              label={t("forms.security_question")}
                              name={ACCOUNT_FIELD_SECURITY_QUESTION}
                              options={securityQuestions}
                              required={fields[ACCOUNT_FIELD_SECURITY_QUESTION]}
                              value={values[ACCOUNT_FIELD_SECURITY_QUESTION]}
                              onSetFieldValue={setFieldValue}
                            />
                            <InputField
                              disabled={isSubmitting}
                              id={ACCOUNT_FIELD_SECURITY_ANSWER}
                              label={t("forms.security_answer")}
                              name={ACCOUNT_FIELD_SECURITY_ANSWER}
                              placeholder={t("forms.security_answer_placeholder")}
                              required={fields[ACCOUNT_FIELD_SECURITY_QUESTION]}
                              textError={
                                touched[ACCOUNT_FIELD_SECURITY_QUESTION] &&
                                (errors[ACCOUNT_FIELD_SECURITY_QUESTION] || apiErrors[ACCOUNT_FIELD_SECURITY_QUESTION])
                              }
                              type="text"
                              value={values[ACCOUNT_FIELD_SECURITY_ANSWER]}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={classes["form__checkboxes"]}>
                    <CheckboxField
                      required
                      checked={ageConfirmationChecked}
                      id="registration__checkbox2"
                      label={t("vanilladesktop.tick_18yo")}
                      name="registration__checkbox"
                      onChecked={setAgeConfirmationChecked}
                    />
                  </div>
                  <button
                    className={cx(classes["form__button"], classes["form__button_special"], {
                      [classes["disabled"]]: isSubmitting,
                    })}
                    style={{ opacity: isSubmitting || !ageConfirmationChecked || !termsAndConditionsChecked ? 0.5 : 1 }}
                    type="submit"
                  >
                    {t("create_account")}
                    {/* <a className={cx(classes["form__popup-link"], classes["popup-link"])} href="#popup-registration" /> */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AccountCreatePage;
