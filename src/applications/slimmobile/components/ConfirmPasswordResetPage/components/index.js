import ItemButton from "applications/slimmobile/common/components/ItemButton";
import ItemInputPassword from "applications/slimmobile/common/components/ItemInputPassword";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import {
  ACCOUNT_PASSWORD_CHANGE_NEW,
  ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM,
} from "constants/account-password-change-fields";
import { ALERT_SUCCESS_ACCOUNT_PASSWORD_UPDATED } from "constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE } from "constants/exceptions-types";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { passwordResetConfirm, passwordResetValidate } from "redux/slices/accountSlice";
import { getAccountPasswordResetFormValidation } from "utils/account-profile/account-password-edit-validation-schema";
import { alertError, getAlertErrorMessage } from "utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "utils/alert-success";

import { getPatternRequestPasswordReset } from "../../../../../utils/route-patterns";
import CentralCarousel from "../../../common/components/CentralCarousel";
import CentralIFrame from "../../../common/components/CentralIFrame";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const propTypes = {};
const defaultProps = {};

const AccountPasswordEditPage = () => {
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
    return <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />;
  }

  if (!validToken && tokenValidationError) {
    return (
      <div className={`${classes["main"]} ${classes["main_edit-profile"]}`}>
        <CentralCarousel />
        <CentralIFrame />
        <div className={classes["edit-profile"]}>
          <h1 className={classes["main__label"]}>{t("change_my_password")}</h1>
          <div className={classes["main__edit-profile"]}>
            <div className={`${classes["box"]} ${classes["box__password"]}`}>
              <h2 className={classes["box__title"]}>{t("details")}</h2>
              <div className={classes["box__container"]}>
                {tokenValidationError}
                <ItemButton
                  isDisabled={isSubmitting}
                  label={t("reset")}
                  type="submit"
                  onClick={() => history.push(getPatternRequestPasswordReset())}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${classes["main"]} ${classes["main_edit-profile"]}`}>
      <CentralCarousel />
      <CentralIFrame />
      <div className={classes["edit-profile"]}>
        <h1 className={classes["main__label"]}>{t("change_my_password")}</h1>
        <div className={classes["main__edit-profile"]}>
          <div className={`${classes["box"]} ${classes["box__password"]}`}>
            <h2 className={classes["box__title"]}>{t("details")}</h2>
            <div className={classes["box__container"]}>
              <form onSubmit={handleSubmit}>
                <ItemInputPassword
                  isRequired
                  id={ACCOUNT_PASSWORD_CHANGE_NEW}
                  isDisabled={isSubmitting}
                  label={t("forms.new_password")}
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
                  label={t("forms.confirm_password")}
                  name={ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM}
                  textError={
                    touched[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM] && errors[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]
                  }
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
    </div>
  );
};

AccountPasswordEditPage.propTypes = propTypes;
AccountPasswordEditPage.defaultProps = defaultProps;

export default AccountPasswordEditPage;
