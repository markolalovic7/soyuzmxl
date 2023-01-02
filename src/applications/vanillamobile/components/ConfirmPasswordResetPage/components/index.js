import { useFormik } from "formik";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

import { getPatternRequestPasswordReset } from "../../../../../utils/route-patterns";

import ItemButton from "applications/vanillamobile/common/components/ItemButton";
import ItemInputPassword from "applications/vanillamobile/common/components/ItemInputPassword";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import {
  ACCOUNT_PASSWORD_CHANGE_NEW,
  ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM,
} from "constants/account-password-change-fields";
import { ALERT_SUCCESS_ACCOUNT_PASSWORD_UPDATED } from "constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE } from "constants/exceptions-types";
import { passwordResetConfirm, passwordResetValidate } from "redux/slices/accountSlice";
import { getAccountPasswordResetFormValidation } from "utils/account-profile/account-password-edit-validation-schema";
import { alertError, getAlertErrorMessage } from "utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "utils/alert-success";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {};
const defaultProps = {};

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
    <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />;
  }

  if (!validToken && tokenValidationError) {
    return (
      <div className={classes["main"]}>
        <h1 className={classes["main__title"]}>{t("change_my_password")}</h1>
        <div className={classes["main__container"]}>{tokenValidationError}</div>
        <ItemButton
          isDisabled={isSubmitting}
          label={t("reset")}
          type="submit"
          onClick={() => history.push(getPatternRequestPasswordReset())}
        />
      </div>
    );
  }

  return (
    <div className={classes["main"]}>
      <h1 className={classes["main__title"]}>{t("change_my_password")}</h1>
      <div className={classes["main__container"]}>
        <div className={classes["form"]}>
          <h2 className={classes["form__title"]}>{t("details")}</h2>
          <div className={classes["form__container"]}>
            <form onSubmit={handleSubmit}>
              <ItemInputPassword
                isRequired
                id={ACCOUNT_PASSWORD_CHANGE_NEW}
                isDisabled={isSubmitting}
                label="New Password"
                name={ACCOUNT_PASSWORD_CHANGE_NEW}
                textError={touched[ACCOUNT_PASSWORD_CHANGE_NEW] && errors[ACCOUNT_PASSWORD_CHANGE_NEW]}
                value={values[ACCOUNT_PASSWORD_CHANGE_NEW]}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <ItemInputPassword
                isRequired
                id={ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM}
                isDisabled={isSubmitting}
                label="Confirm Password"
                name={ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM}
                textError={touched[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM] && errors[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]}
                value={values[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <ItemButton isDisabled={isSubmitting} label={t("update_password")} type="submit" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmPasswordResetPage.propTypes = propTypes;
ConfirmPasswordResetPage.defaultProps = defaultProps;

export default ConfirmPasswordResetPage;
