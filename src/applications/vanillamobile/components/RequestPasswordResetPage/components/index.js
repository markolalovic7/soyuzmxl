import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { ACCOUNT_REGISTRATION_MODE_MOBILE } from "../../../../../constants/account-registration-modes";
import { getCmsConfigAccounts } from "../../../../../redux/reselect/cms-selector";
import ItemInput from "../../../common/components/ItemInput";

import ItemButton from "applications/vanillamobile/common/components/ItemButton";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { requestPasswordReset } from "redux/slices/accountSlice";

const getLabel = (t, registrationMode) => {
  switch (registrationMode) {
    case ACCOUNT_REGISTRATION_MODE_MOBILE:
      return t("mobile_number");
    default:
      return t("forms.email");
  }
};

const propTypes = {};
const defaultProps = {};

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
    <div className={classes["main"]}>
      <h1 className={classes["main__title"]}>{t("change_my_password")}</h1>
      <div className={classes["main__container"]}>
        <div className={classes["form"]}>
          <h2 className={classes["form__title"]}>{t("details")}</h2>
          <div className={classes["form__container"]}>
            <ItemInput
              isRequired
              id="id"
              label={label}
              name="id"
              value={fieldText}
              onBlur={(e) => setFieldText(e.target.value)}
              onChange={(e) => setFieldText(e.target.value)}
            />

            <ItemButton isDisabled={fieldText.trim().length === 0} label={t("reset")} type="submit" onClick={submit} />
          </div>
        </div>
      </div>
    </div>
  );
};

RequestPasswordResetPage.propTypes = propTypes;
RequestPasswordResetPage.defaultProps = defaultProps;

export default RequestPasswordResetPage;
