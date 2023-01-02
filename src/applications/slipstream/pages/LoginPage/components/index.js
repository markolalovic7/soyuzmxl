import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";
import isEmpty from "lodash.isempty";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { login } from "../../../../../redux/slices/authSlice";
import LogoPNG from "../../../img/logo.png";

const LoginPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth?.loading);

  const onLoginHandler = () => {
    dispatch(
      login({
        isOperator: true,
        isRetail: true,
        password,
        rememberMe: false,
        username,
      }),
    );
  };

  return (
    <div className={classes["slipstream-body"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["login"]}>
          <div className={classes["connection-error"]}>
            <p>Server is not responding. Retrying every 10 seconds.</p>
          </div>
          <div className={classes["login__wrapper"]}>
            <div className={classes["login__container"]}>
              <img alt="loginlogo" className={classes["login__logo"]} src={LogoPNG} />
              <div className={classes["login__form"]}>
                <div className={classes["login__box"]}>
                  <h1 className={classes["login__title"]}>Login</h1>
                  {error && (
                    <div className={cx(classes["login__message"], { [classes["active"]]: !!error })}>{error}</div>
                  )}
                  <fieldset className={classes["login__inputs"]}>
                    <input
                      required
                      className={cx(classes["login__username"], classes["login__input"])}
                      placeholder={t("enter_username_placeholder")}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      required
                      className={cx(classes["login__password"], classes["login__input"])}
                      placeholder={t("enter_pass_placeholder")}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className={classes["login__controls"]}>
                    <button
                      className={cx(classes["login__control"], classes["login__submit"], {
                        [classes["disabled"]]: loading || isEmpty(username) || isEmpty(password),
                      })}
                      disabled={loading || isEmpty(username) || isEmpty(password)}
                      type="submit"
                      onClick={onLoginHandler}
                    >
                      {loading ? (
                        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                      ) : (
                        t("login")
                      )}
                    </button>
                    {/* <span className={classes['login__loader']}>Initialising</span> */}
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
