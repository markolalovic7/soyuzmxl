import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { Form, Formik } from "formik";
import { useOnClickOutside } from "hooks/utils-hooks";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import { loginSchema } from "../../../../../constants/login-schema";
import { getAuthError, getAuthLoading, getAuthRememberedUsername } from "../../../../../redux/reselect/auth-selector";
import { login } from "../../../../../redux/slices/authSlice";
import { getPatternAccountCreate, getPatternRequestPasswordReset } from "../../../../../utils/route-patterns";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {
  isOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const LoginPopup = ({ isOpened, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const popupContentRef = useRef();

  useOnClickOutside(popupContentRef, onClose);

  const [apiError, setApiError] = useState("");
  const isLoading = useSelector(getAuthLoading);
  const rememberedUsername = useSelector(getAuthRememberedUsername);
  const error = useSelector(getAuthError);

  useEffect(() => {
    setApiError(error);
  }, [error]);

  const onLogin = ({ password, rememberMe, username }) => {
    dispatch(login({ password, rememberMe, username }));
  };

  return (
    <div
      className={cx(classes["popup-login"], classes["popup"], {
        [classes["open"]]: isOpened,
      })}
      id="popup-login"
    >
      <div className={classes["popup__body"]}>
        <div className={cx(classes["popup__content"], classes["popup-login__content"])} ref={popupContentRef}>
          <Formik
            initialValues={{
              password: "",
              rememberMe: !!rememberedUsername,
              username: rememberedUsername || "",
            }}
            validationSchema={loginSchema}
            onSubmit={onLogin}
          >
            {({ dirty, handleChange, isValid, setFieldValue, values }) => (
              <Form>
                <h2 className={classes["popup-login__title"]}>{t("login_into_account")}</h2>
                {apiError && (
                  <div className={classes["popup-login__link"]} style={{ paddingBottom: "12px" }}>
                    {apiError}
                  </div>
                )}
                <div className={classes["popup-login__inputs"]}>
                  <div className={classes["popup-login__input"]}>
                    <input
                      disabled={isLoading}
                      name="username"
                      placeholder={t("enter_username_placeholder")}
                      type="text"
                      value={values.username}
                      onChange={(e) => {
                        handleChange(e);
                        setApiError("");
                      }}
                    />
                  </div>
                  <div className={classes["popup-login__input"]}>
                    <input
                      disabled={isLoading}
                      name="password"
                      placeholder={t("enter_pass_placeholder")}
                      type="password"
                      value={values.password}
                      onChange={(e) => {
                        handleChange(e);
                        setApiError("");
                      }}
                    />
                  </div>
                </div>
                <div className={classes["popup-login__remember"]}>
                  <input id="popup-login__remember" name="rememberMe" type="checkbox" value="popup-login__remember" />
                  <label
                    htmlFor="popup-login__remember"
                    onClick={() => setFieldValue("rememberMe", !values.rememberMe)}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </label>
                  <span>{t("remember_name_login_question")}</span>
                </div>
                <button
                  className={classes["popup-login__login"]}
                  disabled={!dirty || !isValid || isLoading}
                  style={{ opacity: !dirty || !isValid || isLoading ? 0.5 : 1 }}
                  type="submit"
                >
                  {isLoading ? (
                    <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                  ) : (
                    t("login")
                  )}
                </button>
                <div className={classes["popup-login__links"]}>
                  {location.pathname !== getPatternAccountCreate() && (
                    <Link className={classes["popup-login__link"]} to={getPatternAccountCreate()}>
                      {t("create_new_account")}
                    </Link>
                  )}
                  {location.pathname !== getPatternRequestPasswordReset() && (
                    <Link className={classes["popup-login__link"]} to={getPatternRequestPasswordReset()}>
                      {t("forgot_pass_question")}
                    </Link>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

LoginPopup.propTypes = propTypes;

export default LoginPopup;
