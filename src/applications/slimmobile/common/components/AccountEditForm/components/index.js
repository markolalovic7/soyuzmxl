import {
  ACCOUNT_FIELD_ADDRESS,
  ACCOUNT_FIELD_CITY,
  ACCOUNT_FIELD_IDENTITY_DOCUMENT,
  ACCOUNT_FIELD_LANGUAGE_CODE,
  ACCOUNT_FIELD_POSTCODE,
  ACCOUNT_FIELD_PRICE_FORMAT,
} from "constants/account-fields";
import { ALERT_SUCCESS_ACCOUNT_UPDATED } from "constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_UPDATE } from "constants/exceptions-types";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateAccount } from "redux/slices/accountSlice";
import { getAccountEditInitialValues } from "utils/account-profile/account-edit";
import { useFocusOnError } from "utils/account-profile/hooks";
import { alertError, getAlertErrorMessage } from "utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "utils/alert-success";
import { getDatejsObject } from "utils/dayjs";
import { formatDateYearMonthDay } from "utils/dayjs-format";
import { getGenderTranslated } from "utils/ui-labels";

import { getCmsConfigAccounts } from "../../../../../../redux/reselect/cms-selector";
import { getProfileFormValidation } from "../../../../../../utils/account-profile/account-edit-validation-schema";
import { isDefined } from "../../../../../../utils/lodash";
import classes from "../../../../scss/slimmobilestyle.module.scss";
import ItemButton from "../../ItemButton";
import ItemInput from "../../ItemInput";
import ItemSelect from "../../ItemSelect";

const propTypes = {
  accountId: PropTypes.number.isRequired,
  address: PropTypes.string,
  buttonLabel: PropTypes.string,
  city: PropTypes.string,
  countryCode: PropTypes.string,
  currencyCode: PropTypes.string,
  defaultLanguage: PropTypes.string,
  defaultPriceFormat: PropTypes.string,
  dob: PropTypes.string,
  email: PropTypes.string,
  firstName: PropTypes.string,
  gender: PropTypes.string,
  identityDocument: PropTypes.string,
  languages: PropTypes.array,
  lastName: PropTypes.string,
  mobile: PropTypes.string,
  postcode: PropTypes.string,
  priceFormats: PropTypes.array,
  userName: PropTypes.string,
};

const defaultProps = {
  address: "",
  buttonLabel: "Update",
  city: "",
  countryCode: undefined,
  currencyCode: undefined,
  defaultLanguage: undefined,
  defaultPriceFormat: undefined,
  dob: undefined,
  email: undefined,
  firstName: undefined,
  gender: undefined,
  identityDocument: "",
  languages: [],
  lastName: undefined,
  mobile: undefined,
  postcode: undefined,
  priceFormats: [],
  userName: undefined,
};

const AccountEditForm = ({
  accountId,
  address,
  buttonLabel,
  city,
  countryCode,
  currencyCode,
  defaultLanguage,
  defaultPriceFormat,
  dob,
  email,
  firstName,
  gender,
  identityDocument,
  languages,
  lastName,
  mobile,
  postcode,
  priceFormats,
  userName,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [apiErrors, setApiErrors] = useState([]);

  const cmsConfigAccounts = useSelector(getCmsConfigAccounts);

  const {
    data: { fields },
  } = cmsConfigAccounts || { data: {} };

  const priceFormatsItems = useMemo(
    () =>
      priceFormats.map((item) => ({
        key: item,
        label: t(`price_formats.${item}`),
        value: item,
      })),
    [priceFormats, t],
  );

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
      defaultLanguage,
      defaultPriceFormat,
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

        return;
      }
      if (resultAction.payload) {
        // Todo: Implement `getErrors`.
        const errors = resultAction.payload;
        if (Object.keys(errors).length !== 0) {
          setTouched(errors);
          setApiErrors(errors);

          return;
        }
      }
      alertError(getAlertErrorMessage(EXCEPTION_INVALID_PARAMS_ACCOUNT_UPDATE, t));
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
          {firstName && (
            <ItemInput isDisabled label={t("forms.first_name")} placeholder={t("forms.first_name")} value={firstName} />
          )}
          {lastName && (
            <ItemInput isDisabled label={t("forms.last_name")} placeholder={t("forms.last_name")} value={lastName} />
          )}
          {dob && (
            <ItemInput isDisabled label={t("forms.birth_date")} value={formatDateYearMonthDay(getDatejsObject(dob))} />
          )}
          {gender && <ItemInput isDisabled label={t("forms.gender")} value={getGenderTranslated(gender, t)} />}
          {isDefined(fields[ACCOUNT_FIELD_CITY]) && (
            <ItemInput
              id={ACCOUNT_FIELD_CITY}
              isDisabled={isSubmitting}
              label={t("forms.city")}
              name={ACCOUNT_FIELD_CITY}
              placeholder={t("forms.city_placeholder")}
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
              label={t("forms.address")}
              name={ACCOUNT_FIELD_ADDRESS}
              placeholder={t("forms.address_placeholder")}
              textError={
                touched[ACCOUNT_FIELD_ADDRESS] && (errors[ACCOUNT_FIELD_ADDRESS] || apiErrors[ACCOUNT_FIELD_ADDRESS])
              }
              value={values[ACCOUNT_FIELD_ADDRESS]}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          )}
          {isDefined(fields[ACCOUNT_FIELD_POSTCODE]) && (
            <ItemInput
              id={ACCOUNT_FIELD_POSTCODE}
              isDisabled={isSubmitting}
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
          {countryCode && <ItemInput isDisabled label={t("forms.country")} value={countryCode} />}
          {mobile && <ItemInput isDisabled label={t("forms.mobile_number")} type="tel" value={mobile} />}
          {isDefined(fields[ACCOUNT_FIELD_LANGUAGE_CODE]) && (
            <ItemSelect
              isDisabled={isSubmitting}
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
              items={priceFormatsItems}
              label={t("forms.price_format")}
              name={ACCOUNT_FIELD_PRICE_FORMAT}
              value={values[ACCOUNT_FIELD_PRICE_FORMAT]}
              onSetFieldValue={setFieldValue}
            />
          )}
          {currencyCode && <ItemInput isDisabled label={t("forms.currency")} value={currencyCode} />}
          {isDefined(fields[ACCOUNT_FIELD_IDENTITY_DOCUMENT]) && (
            <ItemInput
              id={ACCOUNT_FIELD_IDENTITY_DOCUMENT}
              isDisabled={isSubmitting}
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
        </div>
      </div>
      <div className={`${classes["box"]} ${classes["box_password"]}`}>
        <h3 className={classes["box__title"]}>{t("forms.account_details")}</h3>
        <div className={classes["box__container"]}>
          {userName && <ItemInput isDisabled label={t("forms.username")} value={userName} />}
          {email && <ItemInput isDisabled label={t("forms.email")} value={email} />}
          <ItemButton isDisabled={isSubmitting} label={buttonLabel} type="submit" />
        </div>
      </div>
    </form>
  );
};

AccountEditForm.propTypes = propTypes;
AccountEditForm.defaultProps = defaultProps;

export default AccountEditForm;
