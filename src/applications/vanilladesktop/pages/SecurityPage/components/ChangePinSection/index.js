import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { ACCOUNT_FIELD_PIN } from "../../../../../../constants/account-fields";
import { ALERT_SUCCESS_ACCOUNT_UPDATED } from "../../../../../../constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE } from "../../../../../../constants/exceptions-types";
import { getAuthAccountId } from "../../../../../../redux/reselect/auth-selector";
import { updateAccount } from "../../../../../../redux/slices/accountSlice";
import { getAccountPinChangeFormValidation } from "../../../../../../utils/account-profile/account-pin-edit-validation-schema";
import { alertError, getAlertErrorMessage } from "../../../../../../utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "../../../../../../utils/alert-success";
import InputField from "../../../../components/FormFields/InputField";
import classes from "../../../../scss/vanilladesktop.module.scss";

const ChangePinSection = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const accountId = useSelector(getAuthAccountId);

  const { errors, handleBlur, handleChange, handleSubmit, isSubmitting, isValidating, touched, validateForm, values } =
    useFormik({
      initialValues: {
        [ACCOUNT_FIELD_PIN]: "",
      },
      onSubmit: async (valuesSubmitted) => {
        validateForm(valuesSubmitted);
        // Do not save if form is already submitted.
        if (isValidating && isSubmitting) {
          return;
        }
        const resultAction = await dispatch(
          updateAccount({
            accountId,
            user: {
              pin: valuesSubmitted[ACCOUNT_FIELD_PIN],
            },
          }),
        );
        if (updateAccount.fulfilled.match(resultAction)) {
          alertSuccess(getAlertSuccessMessage(ALERT_SUCCESS_ACCOUNT_UPDATED, t));
          history.push("/");

          return;
        }
        alertError(getAlertErrorMessage(EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE, t));
      },
      validateOnBlur: true,
      validateOnChange: false,
      validationSchema: getAccountPinChangeFormValidation({ t }),
    });

  return (
    <div className={classes["registration__change-password"]} style={{ marginTop: "20px" }}>
      <form className={classes["registration__form form"]} onSubmit={handleSubmit}>
        <div className={classes["registration__items"]}>
          <div className={classes["registration__item"]}>
            <div className={classes["form__title"]}>{t("change_pin")}</div>
            <div className={classes["form__body"]} style={{ margin: "0 0 10px 0" }}>
              <div className={classes["form__row"]}>
                <InputField
                  required
                  disabled={isSubmitting}
                  id={ACCOUNT_FIELD_PIN}
                  label={t("forms.pin_code")}
                  name={ACCOUNT_FIELD_PIN}
                  placeholder="*********"
                  type="password"
                  value={values[ACCOUNT_FIELD_PIN]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
              <div className={classes["form__row"]} style={{ color: "red" }}>
                {touched[ACCOUNT_FIELD_PIN] && errors[ACCOUNT_FIELD_PIN]}
              </div>
            </div>
            <button className={classes["registration__button"]} disabled={isSubmitting} type="submit">
              {t("update_pin")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ChangePinSection;
