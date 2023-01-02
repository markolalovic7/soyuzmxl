import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { ACCOUNT_FIELD_PIN, ACCOUNT_FIELD_SECURITY_QUESTION } from "../../../../../constants/account-fields";
import { getAuthSelector } from "../../../../../redux/reselect/auth-selector";
import { getCmsConfigAccounts, getCmsSelector } from "../../../../../redux/reselect/cms-selector";
import { loadAccountData } from "../../../../../redux/slices/accountSlice";
import { isDefined } from "../../../../../utils/lodash";

import ChangePasswordSection from "./ChangePasswordSection";
import ChangePinSection from "./ChangePinSection";
import ChangeSecurityQuestionSection from "./ChangeSecurityQuestionsSection";

const SecurityPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const cmsConfigAccounts = useSelector(getCmsConfigAccounts);

  const {
    data: { fields },
  } = cmsConfigAccounts || { data: {} };

  const { lineId, originId } = useSelector(getCmsSelector);
  const { accountId, authToken, language } = useSelector(getAuthSelector);

  useEffect(() => {
    if (accountId && authToken && language && lineId && originId) {
      dispatch(loadAccountData({ accountId, authToken, language, lineId, originId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <main className={classes["main"]}>
      <div className={classes["registration"]}>
        <div className={classes["registration__container"]}>
          <h3 className={classes["registration__label"]}>{t("forms.password_and_security")}</h3>
          <div className={classes["registration__body"]}>
            <div className={classes["registration__promt"]}>
              <span className={classes["registration__star"]}>*&nbsp;</span>
              {` - ${t("vanilladesktop.fields_asterisk")}`}
            </div>

            <ChangePasswordSection />

            {isDefined(fields[ACCOUNT_FIELD_PIN]) && <ChangePinSection />}
            {isDefined(fields[ACCOUNT_FIELD_SECURITY_QUESTION]) && <ChangeSecurityQuestionSection />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SecurityPage;
