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
import ItemButton from "../../../../common/components/ItemButton";
import ItemInput from "../../../../common/components/ItemInput";
import ItemSelect from "../../../../common/components/ItemSelect";
import classes from "../../../../scss/vanillamobilestyle.module.scss";

const SecurityQuestionEditSection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const accountId = useSelector(getAuthAccountId);

  const [apiErrors, setApiErrors] = useState([]);

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
      [ACCOUNT_FIELD_SECURITY_QUESTION]:
        currentSecurityQuestions?.length > 0
          ? currentSecurityQuestions[0].toString()
          : securityQuestions?.length > 0
          ? securityQuestions[0].key
          : undefined,
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
    <div className={classes["form"]}>
      <h2 className={classes["form__title"]}>{t("change_security_answer")}</h2>
      <div className={classes["form__container"]}>
        <form onSubmit={handleSubmit}>
          <ItemSelect
            isDisabled={isSubmitting}
            isRequired={fields[ACCOUNT_FIELD_SECURITY_QUESTION]}
            items={securityQuestions}
            label={t("forms.security_question")}
            name={ACCOUNT_FIELD_SECURITY_QUESTION}
            value={values[ACCOUNT_FIELD_SECURITY_QUESTION]}
            onSetFieldValue={setFieldValue}
          />
          <ItemInput
            id={ACCOUNT_FIELD_SECURITY_ANSWER}
            isDisabled={isSubmitting}
            isRequired={fields[ACCOUNT_FIELD_SECURITY_QUESTION]}
            label={t("forms.security_answer")}
            name={ACCOUNT_FIELD_SECURITY_ANSWER}
            placeholder={t("forms.security_answer_placeholder")}
            textError={
              touched[ACCOUNT_FIELD_SECURITY_ANSWER] &&
              (errors[ACCOUNT_FIELD_SECURITY_ANSWER] || apiErrors[ACCOUNT_FIELD_SECURITY_ANSWER])
            }
            value={values[ACCOUNT_FIELD_SECURITY_ANSWER]}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <ItemButton isDisabled={isSubmitting} label={t("update_security_answer")} type="submit" />
        </form>
      </div>
    </div>
  );
};

export default SecurityQuestionEditSection;
