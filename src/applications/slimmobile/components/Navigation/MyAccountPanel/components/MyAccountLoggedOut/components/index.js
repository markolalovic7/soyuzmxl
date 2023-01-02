import { faCheck, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemButton from "applications/slimmobile/common/components/ItemButton";
import ItemInput from "applications/slimmobile/common/components/ItemInput";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import { loginSchema } from "constants/login-schema";
import { Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAuthError, getAuthLoading, getAuthRememberedUsername } from "redux/reselect/auth-selector";
import { getCmsConfigIframeMode } from "redux/reselect/cms-selector";
import { login } from "redux/slices/authSlice";
import { getHrefAccountCreate } from "utils/route-href";

import { getPatternRequestPasswordReset } from "../../../../../../../../utils/route-patterns";

const propTypes = {
  handleClose: PropTypes.func.isRequired,
};

const MyAccountLoggedOut = ({ handleClose }) => {
  const { t } = useTranslation();
  const [apiError, setApiError] = useState("");
  const dispatch = useDispatch();
  const isLoading = useSelector(getAuthLoading);
  const rememberedUsername = useSelector(getAuthRememberedUsername);
  const error = useSelector(getAuthError);
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  useEffect(() => {
    setApiError(error);
  }, [error]);

  const handleSubmit = ({ password, rememberMe, username }) => {
    dispatch(login({ password, rememberMe, username }));
  };

  return (
    <>
      <div className={classes["login__title"]}>
        <span>{t("welcome_exclamation_mark")}</span>
        <span className={classes["login__icon"]} id="login-close" onClick={handleClose}>
          <i className={classes["qicon-account-login"]} />
        </span>
      </div>
      {!isApplicationEmbedded && (
        <div className={classes["login__body"]}>
          <Formik
            className={classes["login__top"]}
            initialValues={{
              password: "",
              rememberMe: !!rememberedUsername,
              username: rememberedUsername || "",
            }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ dirty, handleChange, isValid, setFieldValue, values }) => (
              <Form>
                <div className={classes["login__label"]}>{t("login_into_account")}</div>
                {apiError && (
                  <div className={classes["login__notification"]}>
                    <div className={classes["login__notification-content"]}>
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      {apiError}
                    </div>
                  </div>
                )}
                <ItemInput
                  isDisabled={isLoading}
                  name="username"
                  placeholder={t("enter_username_placeholder")}
                  type="text"
                  value={values.username}
                  onChange={(e) => {
                    handleChange(e);
                    setApiError("");
                  }}
                />
                <ItemInput
                  isDisabled={isLoading}
                  name="password"
                  placeholder={t("enter_pass_placeholder")}
                  type="password"
                  value={values.password}
                  onChange={(e) => {
                    handleChange(e);
                    setApiError("");
                  }}
                />
                <Link className={classes["login__forgot"]} to={getPatternRequestPasswordReset()}>
                  {t("forgot_pass_question")}
                </Link>
                <div className={classes["login__remember"]}>
                  <Field className={classes["login__remember_input"]} name="rememberMe" type="checkbox" />
                  <label htmlFor="rememberMe" onClick={() => setFieldValue("rememberMe", !values.rememberMe)}>
                    <FontAwesomeIcon icon={faCheck} />
                  </label>
                  <span>{t("remember_name_login_question")}</span>
                </div>
                <div className={classes["login__btn-login"]} id="login-2-activator">
                  <ItemButton isDisabled={!dirty || !isValid || isLoading} label={t("login")} />
                </div>
                <Link className={classes["login__create"]} to={getHrefAccountCreate()}>
                  {t("create_new_account")}
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

MyAccountLoggedOut.propTypes = propTypes;

export default MyAccountLoggedOut;
