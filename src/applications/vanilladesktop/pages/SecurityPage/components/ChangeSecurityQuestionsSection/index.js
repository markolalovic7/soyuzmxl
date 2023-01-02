import { useFormik } from "formik";
import trim from "lodash.trim";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  ACCOUNT_FIELD_SECURITY_ANSWER,
  ACCOUNT_FIELD_SECURITY_QUESTION,
} from "../../../../../../constants/account-fields";
import { ALERT_SUCCESS_ACCOUNT_UPDATED } from "../../../../../../constants/alert-success-types";
import { EXCEPTION_INVALID_PARAMS_ACCOUNT_UPDATE } from "../../../../../../constants/exceptions-types";
import { useGetSecurityQuestion } from "../../../../../../hooks/security-questions-hooks";
import { getAccountSelector } from "../../../../../../redux/reselect/account-selector";
import { getAuthAccountId } from "../../../../../../redux/reselect/auth-selector";
import { getCmsConfigAccounts } from "../../../../../../redux/reselect/cms-selector";
import { updateAccount } from "../../../../../../redux/slices/accountSlice";
import { getErrors } from "../../../../../../utils/account-profile/account-create";
import { getAccountSecurityQuestionsChangeFormValidation } from "../../../../../../utils/account-profile/account-security-questions-edit-validation-schema";
import { alertError, getAlertErrorMessage } from "../../../../../../utils/alert-error";
import { alertSuccess, getAlertSuccessMessage } from "../../../../../../utils/alert-success";
import InputField from "../../../../components/FormFields/InputField";
import SelectField from "../../../../components/FormFields/SelectField";
import classes from "../../../../scss/vanilladesktop.module.scss";

const ChangeSecurityQuestionSection = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [apiErrors, setApiErrors] = useState([]);

  const accountId = useSelector(getAuthAccountId);

  const securityQuestions = useGetSecurityQuestion(dispatch);

  const cmsConfigAccounts = useSelector(getCmsConfigAccounts);
  const {
    data: { fields },
  } = cmsConfigAccounts || { data: {} };

  const { accountData } = useSelector(getAccountSelector);

  const { securityQuestions: currentSecurityQuestions } = accountData || {};

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValidating,
    setFieldValue,
    setTouched,
    touched,
    validateForm,
    values,
  } = useFormik({
    initialValues: {
      [ACCOUNT_FIELD_SECURITY_ANSWER]: "",
      [ACCOUNT_FIELD_SECURITY_QUESTION]: currentSecurityQuestions?.length > 0 ? currentSecurityQuestions[0] : undefined,
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
            securityQuestionAnswers: {
              [valuesSubmitted[ACCOUNT_FIELD_SECURITY_QUESTION]]: trim(valuesSubmitted[ACCOUNT_FIELD_SECURITY_ANSWER]),
            },
          },
        }),
      );
      if (updateAccount.fulfilled.match(resultAction)) {
        alertSuccess(getAlertSuccessMessage(ALERT_SUCCESS_ACCOUNT_UPDATED, t));
        history.push("/");

        return;
      }

      if (resultAction.payload) {
        const errors = getErrors(resultAction.payload);
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
    validationSchema: getAccountSecurityQuestionsChangeFormValidation({ t }),
  });

  return (
    <div className={classes["registration__change-password"]} style={{ marginTop: "20px" }}>
      <form className={classes["registration__form form"]} onSubmit={handleSubmit}>
        <div className={classes["registration__items"]}>
          <div className={classes["registration__item"]}>
            <div className={classes["form__title"]}>{t("change_security_answer")}</div>
            <div className={classes["form__body"]} style={{ margin: "0 0 10px 0" }}>
              <div className={classes["form__row"]}>
                <SelectField
                  label={t("forms.security_question")}
                  name={ACCOUNT_FIELD_SECURITY_QUESTION}
                  options={securityQuestions}
                  required={fields[ACCOUNT_FIELD_SECURITY_QUESTION]}
                  value={values[ACCOUNT_FIELD_SECURITY_QUESTION]}
                  onSetFieldValue={setFieldValue}
                />
                <InputField
                  disabled={isSubmitting}
                  id={ACCOUNT_FIELD_SECURITY_ANSWER}
                  label={t("forms.security_answer")}
                  name={ACCOUNT_FIELD_SECURITY_ANSWER}
                  placeholder={t("forms.security_answer_placeholder")}
                  required={fields[ACCOUNT_FIELD_SECURITY_QUESTION]}
                  textError={
                    touched[ACCOUNT_FIELD_SECURITY_QUESTION] &&
                    (errors[ACCOUNT_FIELD_SECURITY_QUESTION] || apiErrors[ACCOUNT_FIELD_SECURITY_QUESTION])
                  }
                  type="text"
                  value={values[ACCOUNT_FIELD_SECURITY_ANSWER]}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div style={{ color: "red" }}>
                  {touched[ACCOUNT_FIELD_SECURITY_QUESTION] && errors[ACCOUNT_FIELD_SECURITY_QUESTION]}
                </div>
                <div style={{ color: "red", paddingTop: "8px" }}>
                  {touched[ACCOUNT_FIELD_SECURITY_ANSWER] && errors[ACCOUNT_FIELD_SECURITY_ANSWER]}
                </div>
              </div>
            </div>
            <button className={classes["registration__button"]} disabled={isSubmitting} type="submit">
              {t("update_security_answer")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ChangeSecurityQuestionSection;
