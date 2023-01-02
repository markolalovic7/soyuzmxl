import InputField from "applications/vanilladesktop/components/FormFields/InputField";
import SelectField from "applications/vanilladesktop/components/FormFields/SelectField";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getAccountEditInitialValues } from "utils/account-profile/account-edit";

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
  ACCOUNT_FIELD_POSTCODE,
  ACCOUNT_FIELD_PRICE_FORMAT,
  ACCOUNT_FIELD_USERNAME,
} from "../../../../../constants/account-fields";
import { ALERT_SUCCESS_ACCOUNT_UPDATED } from "../../../../../constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_CREATE } from "../../../../../constants/exceptions-types";
import { useGetCountries } from "../../../../../hooks/countries-hooks";
import { useGetCurrencies } from "../../../../../hooks/currencies-hooks";
import { useGetLanguages } from "../../../../../hooks/languages-hooks";
import { getAccountSelector } from "../../../../../redux/reselect/account-selector";
import { getAuthSelector } from "../../../../../redux/reselect/auth-selector";
import {
  getCmsConfigAccounts,
  getCmsConfigBetting,
  getCmsConfigIsLoading,
  getCmsSelector,
} from "../../../../../redux/reselect/cms-selector";
import { loadAccountData, updateAccount } from "../../../../../redux/slices/accountSlice";
import { getProfileFormValidation } from "../../../../../utils/account-profile/account-edit-validation-schema";
import { useFocusOnError } from "../../../../../utils/account-profile/hooks";
import { alertError, getAlertErrorMessage } from "../../../../../utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "../../../../../utils/alert-success";
import { getDatejsObject } from "../../../../../utils/dayjs";
import { formatDateYearMonthDay } from "../../../../../utils/dayjs-format";
import { isDefined } from "../../../../../utils/lodash";
import { getGenderTranslated } from "../../../../../utils/ui-labels";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AccountUpdatePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [apiErrors, setApiErrors] = useState([]);

  const countries = useGetCountries(dispatch);
  const currencies = useGetCurrencies(dispatch);
  const languages = useGetLanguages(dispatch);

  const cmsConfigIsLoading = useSelector(getCmsConfigIsLoading);
  const cmsConfigAccounts = useSelector(getCmsConfigAccounts);
  const {
    data: { fields },
  } = cmsConfigAccounts || { data: {} };

  const cmsConfigBetting = useSelector(getCmsConfigBetting);
  const {
    data: { priceFormats },
  } = cmsConfigBetting || { data: {} };

  const { lineId, originId } = useSelector(getCmsSelector);

  const { accountId, authToken, language } = useSelector(getAuthSelector);

  useEffect(() => {
    if (accountId && authToken && language && lineId && originId) {
      dispatch(loadAccountData({ accountId, authToken, language, lineId, originId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const { accountData, loading: accountIsLoading } = useSelector(getAccountSelector);

  const {
    address,
    city,
    countryCode,
    currencyCode,
    dob,
    email,
    firstName,
    gender,
    identityDocument,
    languageCode,
    lastName,
    mobile,
    postcode,
    priceFormat,
    username,
  } = accountData || {};

  const priceFormatsItems = useMemo(
    () =>
      priceFormats.map((item) => ({
        key: item,
        label: t(`price_formats.${item}`),
        value: item,
      })),
    [priceFormats, t],
  );

  //   address: valuesSubmitted[ACCOUNT_FIELD_ADDRESS],
  //             city: valuesSubmitted[ACCOUNT_FIELD_CITY],
  //             identityDocument: valuesSubmitted[ACCOUNT_FIELD_IDENTITY_DOCUMENT],
  //             languageCode: valuesSubmitted[ACCOUNT_FIELD_LANGUAGE_CODE],
  //             postcode: valuesSubmitted[ACCOUNT_FIELD_POSTCODE],
  //             priceFormat: valuesSubmitted[ACCOUNT_FIELD_PRICE_FORMAT],
  const profileValidationSchema = useMemo(() => {
    const filteredFields = {};
    filteredFields[ACCOUNT_FIELD_ADDRESS] = fields[ACCOUNT_FIELD_ADDRESS];
    filteredFields[ACCOUNT_FIELD_CITY] = fields[ACCOUNT_FIELD_CITY];
    filteredFields[ACCOUNT_FIELD_IDENTITY_DOCUMENT] = fields[ACCOUNT_FIELD_IDENTITY_DOCUMENT];
    filteredFields[ACCOUNT_FIELD_LANGUAGE_CODE] = fields[ACCOUNT_FIELD_LANGUAGE_CODE];
    filteredFields[ACCOUNT_FIELD_POSTCODE] = fields[ACCOUNT_FIELD_POSTCODE];
    filteredFields[ACCOUNT_FIELD_PRICE_FORMAT] = fields[ACCOUNT_FIELD_PRICE_FORMAT];

    return getProfileFormValidation({
      fields: filteredFields,
      t,
    });
  }, [fields]);

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
    initialValues: getAccountEditInitialValues({
      address,
      city,
      defaultLanguage: languageCode,
      defaultPriceFormat: priceFormat,
      identityDocument,
      postcode,
    }),
    onSubmit: async (valuesSubmitted) => {
      validateForm(valuesSubmitted);
      // Do not create account if form is already submitted.
      if (isValidating && isSubmitting) {
        return;
      }
      const resultAction = await dispatch(
        updateAccount({
          accountId,
          user: {
            address: valuesSubmitted[ACCOUNT_FIELD_ADDRESS],
            city: valuesSubmitted[ACCOUNT_FIELD_CITY],
            identityDocument: valuesSubmitted[ACCOUNT_FIELD_IDENTITY_DOCUMENT],
            languageCode: valuesSubmitted[ACCOUNT_FIELD_LANGUAGE_CODE],
            postcode: valuesSubmitted[ACCOUNT_FIELD_POSTCODE],
            priceFormat: valuesSubmitted[ACCOUNT_FIELD_PRICE_FORMAT],
          },
        }),
      );
      if (updateAccount.fulfilled.match(resultAction)) {
        alertSuccess(getAlertSuccessMessage(ALERT_SUCCESS_ACCOUNT_UPDATED, t));
        history.push("/");

        return;
      }
      if (resultAction.payload) {
        const errors = setErrors(resultAction.payload);
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

  if (cmsConfigIsLoading || accountIsLoading) {
    return <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />;
  }

  return (
    <main className={classes["main"]}>
      <div className={classes["registration"]}>
        <div className={classes["registration__container"]}>
          <h3 className={classes["registration__label"]}>{t("edit_profile")}</h3>
          <div className={classes["registration__body"]}>
            <div className={classes["registration__promt"]}>
              <span className={classes["registration__star"]}>*&nbsp;</span>
              {` - ${t("vanilladesktop.fields_asterisk")}`}
            </div>
            <form action="#" className={cx(classes["registration__form"], classes["form"])} onSubmit={handleSubmit}>
              <div className={classes["registration__items"]}>
                <div className={classes["registration__item"]}>
                  <div className={classes["form__title"]}>{t("personal_details")}</div>
                  <div className={classes["form__body"]}>
                    <div className={classes["form__row"]}>
                      {isDefined(fields[ACCOUNT_FIELD_FIRST_NAME]) && (
                        <InputField
                          disabled
                          id={ACCOUNT_FIELD_FIRST_NAME}
                          label={t("forms.first_name")}
                          name={ACCOUNT_FIELD_FIRST_NAME}
                          placeholder={t("forms.first_name")}
                          type="text"
                          value={firstName}
                        />
                      )}
                      {isDefined(fields[ACCOUNT_FIELD_LAST_NAME]) && (
                        <InputField
                          disabled
                          id={ACCOUNT_FIELD_LAST_NAME}
                          label={t("forms.last_name")}
                          name={ACCOUNT_FIELD_LAST_NAME}
                          placeholder={t("forms.last_name")}
                          type="text"
                          value={lastName}
                        />
                      )}
                    </div>
                    <div className={classes["form__row"]}>
                      {isDefined(fields[ACCOUNT_FIELD_DATE_OF_BIRTH]) && (
                        <InputField
                          disabled
                          id={ACCOUNT_FIELD_DATE_OF_BIRTH}
                          label={t("forms.birth_date")}
                          name={ACCOUNT_FIELD_DATE_OF_BIRTH}
                          placeholder={t("forms.birth_date")}
                          type="text"
                          value={formatDateYearMonthDay(getDatejsObject(dob))}
                        />
                      )}
                      {isDefined(fields[ACCOUNT_FIELD_GENDER]) && (
                        <InputField
                          disabled
                          id={ACCOUNT_FIELD_GENDER}
                          label={t("forms.sex")}
                          name={ACCOUNT_FIELD_GENDER}
                          placeholder={t("forms.sex")}
                          type="text"
                          value={getGenderTranslated(gender, t)}
                        />
                      )}
                    </div>
                    <div className={classes["form__row"]}>
                      {isDefined(fields[ACCOUNT_FIELD_ADDRESS]) && (
                        <InputField
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
                      {isDefined(fields[ACCOUNT_FIELD_CITY]) && (
                        <InputField
                          id={ACCOUNT_FIELD_CITY}
                          label={t("forms.city")}
                          name={ACCOUNT_FIELD_CITY}
                          placeholder={t("forms.city")}
                          required={fields[ACCOUNT_FIELD_CITY]}
                          textError={
                            touched[ACCOUNT_FIELD_CITY] && (errors[ACCOUNT_FIELD_CITY] || apiErrors[ACCOUNT_FIELD_CITY])
                          }
                          type="text"
                          value={values[ACCOUNT_FIELD_CITY]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      )}
                    </div>
                    <div className={classes["form__row"]}>
                      {isDefined(fields[ACCOUNT_FIELD_COUNTRY_CODE]) && (
                        <InputField
                          disabled
                          id={ACCOUNT_FIELD_COUNTRY_CODE}
                          label={t("forms.country")}
                          name={ACCOUNT_FIELD_COUNTRY_CODE}
                          placeholder={t("forms.country")}
                          type="text"
                          value={countries.find((country) => country.value === countryCode)?.label}
                        />
                      )}
                      {isDefined(fields[ACCOUNT_FIELD_POSTCODE]) && (
                        <InputField
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
                    </div>
                    <div className={classes["form__row"]}>
                      {isDefined(fields[ACCOUNT_FIELD_MOBILE]) && (
                        <InputField
                          disabled
                          id={ACCOUNT_FIELD_MOBILE}
                          label={t("forms.mobile_number")}
                          name={ACCOUNT_FIELD_MOBILE}
                          type="text"
                          value={mobile}
                        />
                      )}
                    </div>
                    <div className={classes["form__row"]}>
                      {isDefined(fields[ACCOUNT_FIELD_CURRENCY_CODE]) && (
                        <InputField
                          disabled
                          id={ACCOUNT_FIELD_CURRENCY_CODE}
                          label={t("forms.currency")}
                          name={ACCOUNT_FIELD_CURRENCY_CODE}
                          placeholder={t("forms.currency")}
                          type="text"
                          value={currencies.find((currency) => currency.value === currencyCode)?.label}
                        />
                      )}
                      {isDefined(fields[ACCOUNT_FIELD_LANGUAGE_CODE]) && (
                        <InputField
                          disabled
                          id={ACCOUNT_FIELD_LANGUAGE_CODE}
                          label={t("forms.language")}
                          name={ACCOUNT_FIELD_LANGUAGE_CODE}
                          placeholder={t("forms.language")}
                          type="text"
                          value={languages.find((language) => language.value === languageCode)?.label}
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
                <div className={classes["registration__item"]}>
                  <div className={classes["form__title"]}>{t("forms.account_details")}</div>
                  <div className={classes["form__body"]}>
                    <div className={classes["form__row"]}>
                      {isDefined(fields[ACCOUNT_FIELD_EMAIL]) && (
                        <InputField
                          disabled
                          id={ACCOUNT_FIELD_EMAIL}
                          label={t("forms.email")}
                          name={ACCOUNT_FIELD_EMAIL}
                          placeholder={t("forms.email")}
                          type="email"
                          value={email}
                        />
                      )}
                      {isDefined(fields[ACCOUNT_FIELD_USERNAME]) && (
                        <InputField
                          disabled
                          id={ACCOUNT_FIELD_USERNAME}
                          label={t("forms.username")}
                          name={ACCOUNT_FIELD_USERNAME}
                          placeholder={t("forms.username")}
                          type="text"
                          value={username}
                        />
                      )}
                    </div>
                    <div className={classes["form__row"]}>
                      {isDefined(fields[ACCOUNT_FIELD_IDENTITY_DOCUMENT]) && (
                        <InputField
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
                    </div>
                  </div>

                  <button
                    className={cx(classes["registration__button"])}
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.5 : 1 }}
                    type="submit"
                  >
                    {t("update_account")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountUpdatePage;
