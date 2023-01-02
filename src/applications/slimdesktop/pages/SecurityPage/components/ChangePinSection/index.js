import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
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
    <form className={classes["form__content"]} onSubmit={handleSubmit}>
      <div className={classes["form__container"]}>
        <div className={classes["inputs-box"]} style={{ margin: "0 0 10px 0" }}>
          {" "}
          <div className={classes["inputs-box__header"]}>
            <span className={classes["inputs-box__title"]}>{t("change_pin")}</span>
          </div>
          <div className={classes["inputs-box__body"]}>
            <div className={classes["inputs-box__row"]}>
              <InputField
                required
                disabled={isSubmitting}
                id={ACCOUNT_FIELD_PIN}
                label={t("forms.pin_code")}
                name={ACCOUNT_FIELD_PIN}
                placeholder="*********"
                textError={touched[ACCOUNT_FIELD_PIN] && errors[ACCOUNT_FIELD_PIN]}
                type="password"
                value={values[ACCOUNT_FIELD_PIN]}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <button className={cx(classes["form__button"], { [classes["disabled"]]: isSubmitting })} type="submit">
          {t("update_pin")}
        </button>
      </div>
    </form>
  );
};

export default ChangePinSection;
