import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import getSymbolFromCurrency from "currency-symbol-map";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";

import { loginSchema } from "../../../../../constants/login-schema";
import { logout } from "../../../../../redux/actions/auth-actions";
import { getCachedAssets } from "../../../../../redux/reselect/assets-selectors";
import {
  getAuthDesktopView,
  getAuthError,
  getAuthLoading,
  getAuthLoggedIn,
  getAuthRememberedUsername,
} from "../../../../../redux/reselect/auth-selector";
import { getCmsLayoutDesktopHeaderMenuWidget } from "../../../../../redux/reselect/cms-layout-widgets";
import { getCmsConfigBrandLogos, getCmsConfigIframeMode } from "../../../../../redux/reselect/cms-selector";
import { login } from "../../../../../redux/slices/authSlice";
import { isMenuLinkMatch } from "../../../../../utils/cms-layouts";
import MenuLink from "../../MenuLink";

import LanguageSelector from "./LanguageSelector";
import OddTypeSelector from "./OddTypeSelector";
import ViewTypeSelector from "./ViewTypeSelector";

export default () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const history = useHistory();

  const { pathname } = useLocation();
  const [time, setTime] = useState(dayjs().format("HH:mm:ss"));

  const { brandLogoAssetId } = useSelector(getCmsConfigBrandLogos);
  const assets = useSelector(getCachedAssets);

  const view = useSelector(getAuthDesktopView);
  const isLoggedIn = useSelector(getAuthLoggedIn);
  const currencyCode = useSelector((state) => state.auth?.currencyCode);
  const balance = useSelector((state) => state.balance?.balance);
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);
  const headerWidget = useSelector((state) => getCmsLayoutDesktopHeaderMenuWidget(state, location));

  const [apiError, setApiError] = useState(""); // only required if we later implement a better CSS error solution
  const isLoading = useSelector(getAuthLoading);
  const rememberedUsername = useSelector(getAuthRememberedUsername);
  const error = useSelector(getAuthError);

  useEffect(() => {
    setApiError(error);
    if (error) {
      // temp solution due to lack of a prototypes solution
      alert(error);
    }
  }, [error]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onLogin = ({ password, rememberMe, username }) => {
    dispatch(login({ password, rememberMe, username }));
  };

  return (
    <header className={classes["header"]}>
      <Link className={classes["header__logo"]} to="/live">
        {assets[brandLogoAssetId] && <img alt="logo" src={assets[brandLogoAssetId]} />}
      </Link>
      <div className={classes["header__navigation"]}>
        <div className={classes["header__navigation-top"]}>
          <div className={classes["header__navigation-time"]}>
            <span>{time}</span>
          </div>
          <div className={classes["header__navigation-lang"]}>
            <LanguageSelector />
            <OddTypeSelector />
            <ViewTypeSelector />
          </div>
        </div>
        <nav className={classes["header__menu"]}>
          <ul className={classes["header__menu-list"]}>
            {headerWidget?.children?.map((menuItem) => (
              // One level only

              <li key={menuItem.id}>
                <MenuLink linkEnabled={!(menuItem.children?.length > 0)} navigationData={menuItem.navigationData}>
                  <div
                    className={cx(classes["header__menu-link"], {
                      [classes["active"]]:
                        menuItem.navigationData && isMenuLinkMatch(view, menuItem.navigationData, pathname),
                    })}
                  >
                    {menuItem.description}
                  </div>
                </MenuLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {!isLoggedIn && !isApplicationEmbedded && (
        <div className={classes["header__form"]}>
          <Formik
            className={classes["header__form-login"]}
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
                <input
                  className={classes["header__form-input"]}
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
                <input
                  className={classes["header__form-input"]}
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
                <div className={classes["header__form-btn-box"]}>
                  <button
                    className={classes["header__form-btn"]}
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
                </div>
              </Form>
            )}
          </Formik>
          <div className={classes["header__form-text"]}>
            <span>{t("forgot_pass_question")}</span>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className={classes["header__form"]} style={{ width: "250px" }}>
          <div className={classes["header__form-login"]}>
            <div className={classes["header__form-input"]} style={{ width: "160px" }}>
              {`${getSymbolFromCurrency(currencyCode)} ${balance?.availableBalance.toLocaleString()}`}
            </div>
            <div
              className={classes["header__form-btn-box"]}
              style={{ right: isApplicationEmbedded ? "0px" : "60px", whiteSpace: "nowrap" }}
            >
              <button
                className={classes["header__form-btn"]}
                type="submit"
                // onClick={() => history.push("/mybets")}
              >
                {t("my_bets")}
              </button>
            </div>
            {!isApplicationEmbedded && (
              <div className={classes["header__form-btn-box"]} style={{ whiteSpace: "nowrap" }}>
                <button className={classes["header__form-btn"]} type="submit" onClick={() => dispatch(logout())}>
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
