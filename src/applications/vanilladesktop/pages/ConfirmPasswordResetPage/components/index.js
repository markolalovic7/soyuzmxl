import InputField from "applications/vanilladesktop/components/FormFields/InputField";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import {
  ACCOUNT_PASSWORD_CHANGE_NEW,
  ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM,
  ACCOUNT_PASSWORD_CHANGE_OLD,
} from "../../../../../constants/account-password-change-fields";
import { ALERT_SUCCESS_ACCOUNT_PASSWORD_UPDATED } from "../../../../../constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE } from "../../../../../constants/exceptions-types";
import { passwordResetConfirm, passwordResetValidate } from "../../../../../redux/slices/accountSlice";
import { getAccountPasswordResetFormValidation } from "../../../../../utils/account-profile/account-password-edit-validation-schema";
import { alertError, getAlertErrorMessage } from "../../../../../utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "../../../../../utils/alert-success";
import { getPatternRequestPasswordReset } from "../../../../../utils/route-patterns";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ConfirmPasswordResetPage = () => {
  const { encodedToken } = useParams();
  const token = decodeURIComponent(encodedToken);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const validatingToken = useSelector((state) => state.account.validatingToken);
  const validToken = useSelector((state) => state.account.validToken);
  const tokenValidationError = useSelector((state) => state.account.tokenValidationError);

  useEffect(() => {
    if (token) {
      dispatch(passwordResetValidate({ token }));
    }
  }, [dispatch, token]);

  const { errors, handleBlur, handleChange, handleSubmit, isSubmitting, isValidating, touched, validateForm, values } =
    useFormik({
      initialValues: {
        [ACCOUNT_PASSWORD_CHANGE_NEW]: "",
        [ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]: "",
      },
      onSubmit: async (valuesSubmitted) => {
        validateForm(valuesSubmitted);
        // Do not save if form is already submitted.
        if (isValidating && isSubmitting) {
          return;
        }
        const { [ACCOUNT_PASSWORD_CHANGE_NEW]: password } = valuesSubmitted;
        const resultAction = await dispatch(
          passwordResetConfirm({
            password,
            token,
          }),
        );
        if (passwordResetConfirm.fulfilled.match(resultAction)) {
          alertSuccess(getAlertSuccessMessage(ALERT_SUCCESS_ACCOUNT_PASSWORD_UPDATED, t));
          history.push("/");

          return;
        }
        alertError(getAlertErrorMessage(EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE, t));
      },
      validateOnBlur: true,
      validateOnChange: false,
      validationSchema: getAccountPasswordResetFormValidation({ t }),
    });

  if (validatingToken) {
    return (
      <div className={classes["spinner-container"]}>
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      </div>
    );
  }

  if (!validToken && tokenValidationError) {
    return (
      <main className={classes["main"]}>
        <div className={classes["registration"]}>
          <div className={classes["registration__container"]}>
            <h3 className={classes["registration__label"]}>{t("change_my_password")}</h3>
            <div className={classes["registration__body"]}>
              <div className={classes["registration__promt"]}>
                <span className={classes["registration__star"]}>{tokenValidationError}</span>
              </div>
              <button
                className={classes["registration__button"]}
                type="submit"
                onClick={() => history.push(getPatternRequestPasswordReset())}
              >
                {t("reset")}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={classes["main"]}>
      <div className={classes["registration"]}>
        <div className={classes["registration__container"]}>
          <h3 className={classes["registration__label"]}>{t("change_my_password")}</h3>
          <div className={classes["registration__body"]}>
            <div className={classes["registration__promt"]}>
              <span className={classes["registration__star"]}>*&nbsp;</span>
              {` - ${t("vanilladesktop.fields_asterisk")}`}
            </div>
            <div className={classes["registration__change-password"]}>
              <form className={classes["registration__form form"]} onSubmit={handleSubmit}>
                <div className={classes["registration__items"]}>
                  <div className={classes["registration__item"]}>
                    <div className={classes["form__title"]}>{t("change_password")}</div>
                    <div className={classes["form__body"]}>
                      <div className={classes["form__row"]} style={{ color: "red" }}>
                        {touched[ACCOUNT_PASSWORD_CHANGE_OLD] && errors[ACCOUNT_PASSWORD_CHANGE_OLD]}
                      </div>
                      <div className={classes["form__row"]}>
                        <InputField
                          required
                          disabled={isSubmitting}
                          id={ACCOUNT_PASSWORD_CHANGE_NEW}
                          label={t("forms.new_password")}
                          name={ACCOUNT_PASSWORD_CHANGE_NEW}
                          placeholder="*********"
                          type="password"
                          value={values[ACCOUNT_PASSWORD_CHANGE_NEW]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <InputField
                          required
                          disabled={isSubmitting}
                          id={ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM}
                          label={t("forms.confirm_password")}
                          name={ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM}
                          placeholder="*********"
                          type="password"
                          value={values[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <div style={{ color: "red" }}>
                          {touched[ACCOUNT_PASSWORD_CHANGE_NEW] && errors[ACCOUNT_PASSWORD_CHANGE_NEW]}
                        </div>
                        <div style={{ color: "red", paddingTop: "8px" }}>
                          {touched[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM] && errors[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]}
                        </div>
                      </div>
                    </div>
                    <button className={classes["registration__button"]} disabled={isSubmitting} type="submit">
                      {t("update_password")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConfirmPasswordResetPage;
