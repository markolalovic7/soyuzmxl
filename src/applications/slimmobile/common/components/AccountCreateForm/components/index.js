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
} from "constants/account-fields";
import { ACCOUNT_REGISTRATION_GENDER_ITEMS } from "constants/account-registration-gender-items";
import { ALERT_SUCCESS_ACCOUNT_CREATED } from "constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_CREATE } from "constants/exceptions-types";
import { PHONE_NUMBER_COUNTRY_CODES } from "constants/phone-numbers";
import { useFormik } from "formik";
import trim from "lodash.trim";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { createAccount } from "redux/slices/accountSlice";
import { getErrors, getInitialValues } from "utils/account-profile/account-create";
import { getProfileFormValidation } from "utils/account-profile/account-create-validation-schema";
import { useFocusOnError } from "utils/account-profile/hooks";
import { alertError, getAlertErrorMessage } from "utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "utils/alert-success";
import { getDateObjectNowSubtract18Years } from "utils/dayjs";
import { isDefined } from "utils/lodash";
import { getDateParsed } from "utils/ui-labels";

import classes from "../../../../scss/slimmobilestyle.module.scss";
import ItemButton from "../../ItemButton";
import ItemDatePicker from "../../ItemDatePicker";
import ItemInput from "../../ItemInput";
import ItemSelect from "../../ItemSelect";

const propTypes = {
  buttonLabel: PropTypes.string,
  countries: PropTypes.array,
  currencies: PropTypes.array,
  defaultCountry: PropTypes.string,
  defaultCurrency: PropTypes.string,
  defaultLanguage: PropTypes.string,
  defaultPriceFormat: PropTypes.string,
  fields: PropTypes.object.isRequired,
  languages: PropTypes.array,
  priceFormats: PropTypes.array,
  referrals: PropTypes.array,
  securityQuestions: PropTypes.array,
};

const defaultProps = {
  buttonLabel: "Update",
  countries: [],
  currencies: [],
  defaultCountry: undefined,
  defaultCurrency: undefined,
  defaultLanguage: undefined,
  defaultPriceFormat: undefined,
  languages: [],
  priceFormats: [],
  referrals: [],
  securityQuestions: [],
};

const AccountCreateForm = ({
  buttonLabel,
  countries,
  currencies,
  defaultCountry,
  defaultCurrency,
  defaultLanguage,
  defaultPriceFormat,
  fields,
  languages,
  priceFormats,
  referrals,
  securityQuestions,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [apiErrors, setApiErrors] = useState([]);

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
  useFocusOnError({ errors, isValid, submitCount });

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes["box"]}>
        <h2 className={classes["box__title"]}>{t("personal_details")}</h2>
        <div className={classes["box__container"]}>
          {isDefined(fields[ACCOUNT_FIELD_FIRST_NAME]) && (
            <ItemInput
              id={ACCOUNT_FIELD_FIRST_NAME}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_FIRST_NAME]}
              label={t("forms.first_name")}
              name={ACCOUNT_FIELD_FIRST_NAME}
              placeholder={t("forms.first_name")}
              textError={
                touched[ACCOUNT_FIELD_FIRST_NAME] &&
                (errors[ACCOUNT_FIELD_FIRST_NAME] || apiErrors[ACCOUNT_FIELD_FIRST_NAME])
              }
              value={values[ACCOUNT_FIELD_FIRST_NAME]}
              onBlur={handleBlur}
              onChange={handleChange(ACCOUNT_FIELD_FIRST_NAME)}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_LAST_NAME]) && (
            <ItemInput
              id={ACCOUNT_FIELD_LAST_NAME}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_LAST_NAME]}
              label={t("forms.last_name")}
              name={ACCOUNT_FIELD_LAST_NAME}
              placeholder={t("forms.last_name")}
              textError={
                touched[ACCOUNT_FIELD_LAST_NAME] &&
                (errors[ACCOUNT_FIELD_LAST_NAME] || apiErrors[ACCOUNT_FIELD_LAST_NAME])
              }
              value={values[ACCOUNT_FIELD_LAST_NAME]}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_DATE_OF_BIRTH]) && (
            <ItemDatePicker
              date={values[ACCOUNT_FIELD_DATE_OF_BIRTH]}
              id={ACCOUNT_FIELD_DATE_OF_BIRTH}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_DATE_OF_BIRTH]}
              label={t("forms.birth_date")}
              maxDate={getDateParsed(getDateObjectNowSubtract18Years())}
              name={ACCOUNT_FIELD_DATE_OF_BIRTH}
              type="date"
              onChange={setFieldValue}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_GENDER]) && (
            <ItemSelect
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_GENDER]}
              items={genderItems}
              label={t("forms.sex")}
              name={ACCOUNT_FIELD_GENDER}
              value={values[ACCOUNT_FIELD_GENDER]}
              onSetFieldValue={setFieldValue}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_CITY]) && (
            <ItemInput
              id={ACCOUNT_FIELD_CITY}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_CITY]}
              label={t("forms.city")}
              name={ACCOUNT_FIELD_CITY}
              placeholder={t("forms.city")}
              textError={touched[ACCOUNT_FIELD_CITY] && (errors[ACCOUNT_FIELD_CITY] || apiErrors[ACCOUNT_FIELD_CITY])}
              value={values[ACCOUNT_FIELD_CITY]}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_ADDRESS]) && (
            <ItemInput
              id={ACCOUNT_FIELD_ADDRESS}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_ADDRESS]}
              label={t("forms.address")}
              name={ACCOUNT_FIELD_ADDRESS}
              placeholder={t("forms.address")}
              textError={
                touched[ACCOUNT_FIELD_ADDRESS] && (errors[ACCOUNT_FIELD_ADDRESS] || apiErrors[ACCOUNT_FIELD_ADDRESS])
              }
              value={values[ACCOUNT_FIELD_ADDRESS]}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_COUNTRY_CODE]) && (
            <ItemSelect
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_COUNTRY_CODE]}
              items={countries}
              label={t("forms.country")}
              name={ACCOUNT_FIELD_COUNTRY_CODE}
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
          {isDefined(fields[ACCOUNT_FIELD_POSTCODE]) && (
            <ItemInput
              id={ACCOUNT_FIELD_POSTCODE}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_POSTCODE]}
              label={t("forms.postcode")}
              name={ACCOUNT_FIELD_POSTCODE}
              placeholder={t("forms.postcode_placeholder")}
              textError={
                touched[ACCOUNT_FIELD_POSTCODE] && (errors[ACCOUNT_FIELD_POSTCODE] || apiErrors[ACCOUNT_FIELD_POSTCODE])
              }
              value={values[ACCOUNT_FIELD_POSTCODE]}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_MOBILE]) && (
            <ItemInput
              id={ACCOUNT_FIELD_MOBILE}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_MOBILE]}
              label={t("forms.mobile_number")}
              name={ACCOUNT_FIELD_MOBILE}
              textError={
                touched[ACCOUNT_FIELD_MOBILE] && (errors[ACCOUNT_FIELD_MOBILE] || apiErrors[ACCOUNT_FIELD_MOBILE])
              }
              type="tel"
              value={values[ACCOUNT_FIELD_MOBILE]}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_LANGUAGE_CODE]) && (
            <ItemSelect
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_LANGUAGE_CODE]}
              items={languages}
              label={t("forms.language")}
              name={ACCOUNT_FIELD_LANGUAGE_CODE}
              value={values[ACCOUNT_FIELD_LANGUAGE_CODE]}
              onSetFieldValue={setFieldValue}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_PRICE_FORMAT]) && (
            <ItemSelect
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_PRICE_FORMAT]}
              items={priceFormatsItems}
              label={t("forms.price_format")}
              name={ACCOUNT_FIELD_PRICE_FORMAT}
              value={values[ACCOUNT_FIELD_PRICE_FORMAT]}
              onSetFieldValue={setFieldValue}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_CURRENCY_CODE]) && (
            <ItemSelect
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_CURRENCY_CODE]}
              items={currencies}
              label={t("forms.currency")}
              name={ACCOUNT_FIELD_CURRENCY_CODE}
              value={values[ACCOUNT_FIELD_CURRENCY_CODE]}
              onSetFieldValue={setFieldValue}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_IDENTITY_DOCUMENT]) && (
            <ItemInput
              id={ACCOUNT_FIELD_IDENTITY_DOCUMENT}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_IDENTITY_DOCUMENT]}
              label={t("forms.id_card_number")}
              name={ACCOUNT_FIELD_IDENTITY_DOCUMENT}
              placeholder={t("forms.id_card_number_placeholder")}
              textError={
                touched[ACCOUNT_FIELD_IDENTITY_DOCUMENT] &&
                (errors[ACCOUNT_FIELD_IDENTITY_DOCUMENT] || apiErrors[ACCOUNT_FIELD_IDENTITY_DOCUMENT])
              }
              value={values[ACCOUNT_FIELD_IDENTITY_DOCUMENT]}
              onBlur={handleBlur}
              onChange={(event) => {
                setFieldValue(ACCOUNT_FIELD_IDENTITY_DOCUMENT, event.target.value.toUpperCase());
              }}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_REFERRAL_METHOD]) && (
            <ItemSelect
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_REFERRAL_METHOD]}
              items={referrals}
              label={t("forms.referral")}
              name={ACCOUNT_FIELD_REFERRAL_METHOD}
              value={values[ACCOUNT_FIELD_REFERRAL_METHOD]}
              onSetFieldValue={setFieldValue}
            />
          )}
        </div>
      </div>

      <div className={`${classes["box"]} ${classes["box_password"]}`}>
        <h3 className={classes["box__title"]}>{t("forms.account_details")}</h3>
        <div className={classes["box__container"]}>
          {isDefined(fields[ACCOUNT_FIELD_USERNAME]) && (
            <ItemInput
              id={ACCOUNT_FIELD_USERNAME}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_USERNAME]}
              label={t("forms.username")}
              name={ACCOUNT_FIELD_USERNAME}
              placeholder={t("forms.username")}
              textError={
                touched[ACCOUNT_FIELD_USERNAME] && (errors[ACCOUNT_FIELD_USERNAME] || apiErrors[ACCOUNT_FIELD_USERNAME])
              }
              value={values[ACCOUNT_FIELD_USERNAME]}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_EMAIL]) && (
            <ItemInput
              id={ACCOUNT_FIELD_EMAIL}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_EMAIL]}
              label={t("forms.email")}
              name={ACCOUNT_FIELD_EMAIL}
              placeholder={t("forms.email")}
              textError={
                touched[ACCOUNT_FIELD_EMAIL] && (errors[ACCOUNT_FIELD_EMAIL] || apiErrors[ACCOUNT_FIELD_EMAIL])
              }
              value={values[ACCOUNT_FIELD_EMAIL]}
              onBlur={handleBlur}
              onChange={handleChange(ACCOUNT_FIELD_EMAIL)}
            />
          )}
          <ItemInput
            isRequired
            id={ACCOUNT_FIELD_PASSWORD}
            isDisabled={isSubmitting}
            label={t("forms.password")}
            name={ACCOUNT_FIELD_PASSWORD}
            textError={
              touched[ACCOUNT_FIELD_PASSWORD] && (errors[ACCOUNT_FIELD_PASSWORD] || apiErrors[ACCOUNT_FIELD_PASSWORD])
            }
            type="password"
            value={values[ACCOUNT_FIELD_PASSWORD]}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <ItemInput
            isRequired
            id={ACCOUNT_FIELD_PASSWORD_CONFIRM}
            isDisabled={isSubmitting}
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
          {isDefined(fields[ACCOUNT_FIELD_PIN]) && (
            <ItemInput
              id={ACCOUNT_FIELD_PIN}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_PIN]}
              label={t("forms.pin_code")}
              name={ACCOUNT_FIELD_PIN}
              textError={touched[ACCOUNT_FIELD_PIN] && (errors[ACCOUNT_FIELD_PIN] || apiErrors[ACCOUNT_FIELD_PIN])}
              type="password"
              value={values[ACCOUNT_FIELD_PIN]}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_SECURITY_QUESTION]) && (
            <ItemSelect
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_SECURITY_QUESTION]}
              items={securityQuestions}
              label={t("forms.security_question")}
              name={ACCOUNT_FIELD_SECURITY_QUESTION}
              value={values[ACCOUNT_FIELD_SECURITY_QUESTION]}
              onSetFieldValue={setFieldValue}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_SECURITY_QUESTION]) && (
            <ItemInput
              id={ACCOUNT_FIELD_SECURITY_ANSWER}
              isDisabled={isSubmitting}
              isRequired={fields[ACCOUNT_FIELD_SECURITY_QUESTION]}
              label={t("forms.security_answer")}
              name={ACCOUNT_FIELD_SECURITY_ANSWER}
              placeholder={t("forms.security_answer_placeholder")}
              textError={
                touched[ACCOUNT_FIELD_SECURITY_ANSWER] &&
                (errors[ACCOUNT_FIELD_SECURITY_ANSWER] || apiErrors[ACCOUNT_FIELD_SECURITY_ANSWER])
              }
              value={values[ACCOUNT_FIELD_SECURITY_ANSWER]}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
        </div>
      </div>
      <ItemButton isDisabled={isSubmitting} label={buttonLabel} type="submit" />
    </form>
  );
};

AccountCreateForm.propTypes = propTypes;
AccountCreateForm.defaultProps = defaultProps;

export default AccountCreateForm;
