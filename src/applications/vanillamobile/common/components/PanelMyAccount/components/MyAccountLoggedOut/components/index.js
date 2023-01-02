import { faCheck, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import PropTypes from "prop-types";
import { forwardRef, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import { getPatternChatPage, getPatternRequestPasswordReset } from "../../../../../../../../utils/route-patterns";
import MyAccountSettings from "../../MyAccountSettings";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getCmsConfigBrandDetails, getCmsConfigIframeMode } from "redux/reselect/cms-selector";
import { login } from "redux/slices/authSlice";

const propTypes = {
  onCloseMyAccount: PropTypes.func.isRequired,
  showMyAccount: PropTypes.bool.isRequired,
};

const defaultProps = {};

// todo: refactor in future.
// todo: use formik here.
const MyAccountLoggedOut = forwardRef(({ onCloseMyAccount, showMyAccount }, ref) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth?.loading);
  const rememberedUsername = useSelector((state) => state.auth?.rememberedUsername);
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const {
    data: { chat },
  } = cmsConfigBrandDetails || { data: {} };

  const [username, setUsername] = useState(rememberedUsername || "");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const onLoginHandler = () => {
    dispatch(
      login({
        password,
        rememberMe: checked,
        username,
      }),
    );
  };

  const onRememberMeCheckChanged = () => {
    setChecked(!checked);
  };

  const onNavigateHandler = (event, path) => {
    event.preventDefault();
    onCloseMyAccount();
    history.push(path);
  };

  return (
    <aside className={`${classes["login"]} ${showMyAccount ? classes["active"] : ""}`} id="login-1">
      <div
        className={`${classes["login__container"]} ${showMyAccount ? classes["active"] : ""}`}
        id="login__container-1"
        ref={ref}
      >
        <div className={classes["login__title"]}>
          <span>{t("welcome_exclamation_mark")}</span>
          <span className={classes["login__icon"]} id="login-close" onClick={onCloseMyAccount}>
            <i className={classes["qicon-account-login"]} />
          </span>
        </div>
        {!isApplicationEmbedded && loading && (
          <div className={classes["spinner-container"]}>
            <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
          </div>
        )}
        {!loading && (
          <div className={classes["login__body"]}>
            {!isApplicationEmbedded && (
              <div className={classes["login__top"]}>
                <div className={classes["login__label"]}>{t("login_into_account")}</div>
                {error && (
                  <div className={classes["login__notification"]}>
                    <div className={classes["login__notification-content"]}>
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {error}
                    </div>
                  </div>
                )}
                <div className={classes["login__nickname"]}>
                  <input
                    placeholder={t("enter_username_placeholder")}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className={classes["login__password"]}>
                  <input
                    name="login__password"
                    placeholder={t("enter_pass_placeholder")}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Link className={classes["login__forgot"]} to={getPatternRequestPasswordReset()}>
                  {t("forgot_pass_question")}
                </Link>
                <div className={classes["login__remember"]}>
                  <input
                    checked={checked}
                    className={classes["login__remember_input"]}
                    id="login__remember"
                    name="login__remember"
                    type="checkbox"
                    value="login__remember"
                    onChange={onRememberMeCheckChanged}
                  />
                  <label htmlFor="login__remember">
                    <FontAwesomeIcon icon={faCheck} />
                  </label>
                  <span>{t("remember_me")}</span>
                </div>
                <div className={classes["login__btn-login"]} id="login-2-activator">
                  <button
                    disabled={username.length === 0 || password.length === 0}
                    type="button"
                    onClick={onLoginHandler}
                  >
                    {t("login")}
                  </button>
                </div>
                <a className={classes["login__create"]} onClick={(event) => onNavigateHandler(event, "/createaccount")}>
                  {t("create_account")}
                </a>
                {chat && (
                  <a
                    className={classes["login__create"]}
                    style={{ marginTop: "20px" }}
                    onClick={() => history.push(getPatternChatPage())}
                  >
                    {t("chat.chat")}
                  </a>
                )}
              </div>
            )}

            <MyAccountSettings />
          </div>
        )}
      </div>
    </aside>
  );
});

MyAccountLoggedOut.propTypes = propTypes;
MyAccountLoggedOut.defaultProps = defaultProps;

export default memo(MyAccountLoggedOut);
