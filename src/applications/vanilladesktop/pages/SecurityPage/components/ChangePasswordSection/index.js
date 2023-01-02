import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  ACCOUNT_PASSWORD_CHANGE_NEW,
  ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM,
  ACCOUNT_PASSWORD_CHANGE_OLD,
} from "../../../../../../constants/account-password-change-fields";
import { ALERT_SUCCESS_ACCOUNT_PASSWORD_UPDATED } from "../../../../../../constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE } from "../../../../../../constants/exceptions-types";
import { getAuthAccountId } from "../../../../../../redux/reselect/auth-selector";
import { updatePassword } from "../../../../../../redux/slices/accountSlice";
import { getAccountPasswordChangeFormValidation } from "../../../../../../utils/account-profile/account-password-edit-validation-schema";
import { alertError, getAlertErrorMessage } from "../../../../../../utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "../../../../../../utils/alert-success";
import InputField from "../../../../components/FormFields/InputField";
import classes from "../../../../scss/vanilladesktop.module.scss";

const ChangePasswordSection = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const accountId = useSelector(getAuthAccountId);

  const { errors, handleBlur, handleChange, handleSubmit, isSubmitting, isValidating, touched, validateForm, values } =
    useFormik({
      initialValues: {
        [ACCOUNT_PASSWORD_CHANGE_NEW]: "",
        [ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]: "",
        [ACCOUNT_PASSWORD_CHANGE_OLD]: "",
      },
      onSubmit: async (valuesSubmitted) => {
        validateForm(valuesSubmitted);
        // Do not save if form is already submitted.
        if (isValidating && isSubmitting) {
          return;
        }
        const { [ACCOUNT_PASSWORD_CHANGE_NEW]: password, [ACCOUNT_PASSWORD_CHANGE_OLD]: oldPassword } = valuesSubmitted;
        const resultAction = await dispatch(
          updatePassword({
            accountId,
            oldPassword,
            password,
          }),
        );
        if (updatePassword.fulfilled.match(resultAction)) {
          alertSuccess(getAlertSuccessMessage(ALERT_SUCCESS_ACCOUNT_PASSWORD_UPDATED, t));
          history.push("/");

          return;
        }
        alertError(getAlertErrorMessage(EXCEPTION_INVALID_PARAMS_ACCOUNT_PASSWORD_UPDATE, t));
      },
      validateOnBlur: true,
      validateOnChange: false,
      validationSchema: getAccountPasswordChangeFormValidation({ t }),
    });

  return (
    <div className={classes["registration__change-password"]}>
      <form className={classes["registration__form form"]} onSubmit={handleSubmit}>
        <div className={classes["registration__items"]}>
          <div className={classes["registration__item"]}>
            <div className={classes["form__title"]}>{t("change_password")}</div>
            <div className={classes["form__body"]} style={{ margin: "0 0 10px 0" }}>
              <div className={classes["form__row"]}>
                <InputField
                  required
                  disabled={isSubmitting}
                  id={ACCOUNT_PASSWORD_CHANGE_OLD}
                  label={t("forms.old_password")}
                  name={ACCOUNT_PASSWORD_CHANGE_OLD}
                  placeholder="*********"
                  type="password"
                  value={values[ACCOUNT_PASSWORD_CHANGE_OLD]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
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
  );
};
export default ChangePasswordSection;
