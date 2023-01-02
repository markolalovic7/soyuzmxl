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
import ItemButton from "../../../../common/components/ItemButton";
import ItemInputPassword from "../../../../common/components/ItemInputPassword";
import classes from "../../../../scss/vanillamobilestyle.module.scss";

const PasswordEditSection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
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
    <div className={classes["form"]}>
      <h2 className={classes["form__title"]}>{t("change_password")}</h2>
      <div className={classes["form__container"]}>
        <form onSubmit={handleSubmit}>
          <ItemInputPassword
            isRequired
            id={ACCOUNT_PASSWORD_CHANGE_OLD}
            isDisabled={isSubmitting}
            label={t("forms.old_password")}
            name={ACCOUNT_PASSWORD_CHANGE_OLD}
            textError={touched[ACCOUNT_PASSWORD_CHANGE_OLD] && errors[ACCOUNT_PASSWORD_CHANGE_OLD]}
            value={values[ACCOUNT_PASSWORD_CHANGE_OLD]}
            onBlur={handleBlur}
            onChange={handleChange}
          />
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
            textError={touched[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM] && errors[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]}
            value={values[ACCOUNT_PASSWORD_CHANGE_NEW_CONFIRM]}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <ItemButton isDisabled={isSubmitting} label={t("update_password")} type="submit" />
        </form>
      </div>
    </div>
  );
};

export default PasswordEditSection;
