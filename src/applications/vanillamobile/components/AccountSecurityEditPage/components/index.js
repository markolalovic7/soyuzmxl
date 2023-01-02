import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { ACCOUNT_FIELD_PIN, ACCOUNT_FIELD_SECURITY_QUESTION } from "../../../../../constants/account-fields";
import { getAccountSelector } from "../../../../../redux/reselect/account-selector";
import { getCmsConfigAccounts, getCmsSelector } from "../../../../../redux/reselect/cms-selector";
import { isDefined } from "../../../../../utils/lodash";

import PasswordEditSection from "./PasswordEditSection";
import PinEditSection from "./PinEditSection";
import SecurityQuestionEditSection from "./SecurityQuestionEditSection";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getAuthSelector } from "redux/reselect/auth-selector";
import { loadAccountData } from "redux/slices/accountSlice";

const propTypes = {};
const defaultProps = {};

const AccountSecurityEditPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { lineId, originId } = useSelector(getCmsSelector);
  const { accountId, authToken, language } = useSelector(getAuthSelector);
  const { accountData } = useSelector(getAccountSelector);

  const cmsConfigAccounts = useSelector(getCmsConfigAccounts);

  const {
    data: { fields },
  } = cmsConfigAccounts || { data: {} };

  useEffect(() => {
    if (accountId && authToken && language && lineId && originId) {
      dispatch(loadAccountData({ accountId, authToken, language, lineId, originId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className={classes["main"]}>
      <h1 className={classes["main__title"]}>{t("forms.password_and_security")}</h1>
      <div className={classes["main__container"]}>
        <PasswordEditSection />
        {isDefined(fields[ACCOUNT_FIELD_PIN]) && <PinEditSection />}
        {accountData && isDefined(fields[ACCOUNT_FIELD_SECURITY_QUESTION]) && <SecurityQuestionEditSection />}
      </div>
    </div>
  );
};

AccountSecurityEditPage.propTypes = propTypes;
AccountSecurityEditPage.defaultProps = defaultProps;

export default AccountSecurityEditPage;
