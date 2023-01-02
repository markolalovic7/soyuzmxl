import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
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
import ChangeSecurityQuestionSection from "./ChangeSecurityQuestionSection";

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
      <section className={cx(classes["content"], classes["content_form"])}>
        <div className={classes["rf"]}>
          <div className={classes["form"]}>
            <div className={classes["form__header"]}>
              <span className={classes["form__title"]}>{t("forms.password_and_security")}</span>
            </div>
            <div className={classes["form__body"]}>
              <div className={classes["form__label"]}>
                <i>*</i> {` - ${t("vanilladesktop.fields_asterisk")}`}
              </div>

              <ChangePasswordSection />
              <div style={{ height: "20px" }} />
              {isDefined(fields[ACCOUNT_FIELD_PIN]) && <ChangePinSection />}
              <div style={{ height: "20px" }} />
              {isDefined(fields[ACCOUNT_FIELD_SECURITY_QUESTION]) && <ChangeSecurityQuestionSection />}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default SecurityPage;
