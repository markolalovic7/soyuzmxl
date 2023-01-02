import ItemButton from "applications/slimmobile/common/components/ItemButton";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { requestPasswordReset } from "redux/slices/accountSlice";

import { ACCOUNT_REGISTRATION_MODE_MOBILE } from "../../../../../constants/account-registration-modes";
import { getCmsConfigAccounts } from "../../../../../redux/reselect/cms-selector";
import CentralCarousel from "../../../common/components/CentralCarousel";
import CentralIFrame from "../../../common/components/CentralIFrame";
import ItemInput from "../../../common/components/ItemInput";

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
    <div className={`${classes["main"]} ${classes["main_edit-profile"]}`}>
      <CentralCarousel />
      <CentralIFrame />
      <div className={classes["edit-profile"]}>
        <h1 className={classes["main__label"]}>{t("change_my_password")}</h1>
        <div className={classes["main__edit-profile"]}>
          <div className={`${classes["box"]} ${classes["box__password"]}`}>
            <h2 className={classes["box__title"]}>{t("details")}</h2>
            <div className={classes["box__container"]}>
              <ItemInput
                isRequired
                id={label}
                label={label}
                name={label}
                value={fieldText.trim()}
                onBlur={(e) => setFieldText(e.target.value)}
                onChange={(e) => setFieldText(e.target.value)}
              />
              <ItemButton
                isDisabled={fieldText.trim().length === 0}
                label={t("reset")}
                type="submit"
                onClick={submit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RequestPasswordResetPage.propTypes = propTypes;
RequestPasswordResetPage.defaultProps = defaultProps;

export default RequestPasswordResetPage;
