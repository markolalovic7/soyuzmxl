import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { ACCOUNT_REGISTRATION_MODE_MOBILE } from "../../../../../constants/account-registration-modes";
import { getCmsConfigAccounts } from "../../../../../redux/reselect/cms-selector";
import { requestPasswordReset } from "../../../../../redux/slices/accountSlice";

const getLabel = (t, registrationMode) => {
  switch (registrationMode) {
    case ACCOUNT_REGISTRATION_MODE_MOBILE:
      return t("mobile_number");
    default:
      return t("forms.email");
  }
};

const RequestPasswordResetPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const [fieldText, setFieldText] = useState("");

  const cmsConfigAccounts = useSelector(getCmsConfigAccounts);
  const {
    data: { registrationMode },
  } = cmsConfigAccounts || { data: {} };

  const label = getLabel(t, registrationMode);

  const submit = () => {
    // call API...
    const request =
      registrationMode === ACCOUNT_REGISTRATION_MODE_MOBILE
        ? { mobile: fieldText.trim() }
        : { email: fieldText.trim() };
    dispatch(requestPasswordReset(request));
    setFieldText("");
    alert(t("request_password_reset_acknowledgement"));
    history.push("/");
  };

  return (
    <main className={classes["main"]}>
      <div className={classes["registration"]}>
        <div className={classes["registration__container"]}>
          <h3 className={classes["registration__label"]}>{t("forgot_pass_question")}</h3>
          <div className={classes["registration__body"]}>
            <div className={classes["registration__change-password"]}>
              <div className={classes["registration__items"]}>
                <div className={classes["registration__item"]}>
                  <div className={classes["form__title"]}>{t("change_password")}</div>
                  <div className={classes["form__body"]}>
                    <div className={classes["form__row"]}>
                      <div className={classes["form__item"]}>
                        <div className={classes["form__label"]}>
                          <span>{label}</span>
                        </div>
                        <div className={classes["form__input"]}>
                          <input type="text" value={fieldText} onChange={(e) => setFieldText(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <button
                      className={classes["registration__button"]}
                      disabled={fieldText.trim().length === 0}
                      style={{ opacity: fieldText.trim().length === 0 ? 0.5 : "" }}
                      type="submit"
                      onClick={submit}
                    >
                      {t("reset")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RequestPasswordResetPage;
