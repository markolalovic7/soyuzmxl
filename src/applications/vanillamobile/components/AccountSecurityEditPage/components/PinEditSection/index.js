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
import ItemButton from "../../../../common/components/ItemButton";
import ItemInputPassword from "../../../../common/components/ItemInputPassword";
import classes from "../../../../scss/vanillamobilestyle.module.scss";

const PinEditSection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
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
    <div className={classes["form"]}>
      <h2 className={classes["form__title"]}>{t("change_pin")}</h2>
      <div className={classes["form__container"]}>
        <form onSubmit={handleSubmit}>
          <ItemInputPassword
            isRequired
            id={ACCOUNT_FIELD_PIN}
            isDisabled={isSubmitting}
            label={t("forms.pin_code")}
            name={ACCOUNT_FIELD_PIN}
            textError={touched[ACCOUNT_FIELD_PIN] && errors[ACCOUNT_FIELD_PIN]}
            value={values[ACCOUNT_FIELD_PIN]}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <ItemButton isDisabled={isSubmitting} label={t("update_pin")} type="submit" />
        </form>
      </div>
    </div>
  );
};

export default PinEditSection;
