import AccountCreateForm from "applications/slimmobile/common/components/AccountCreateForm";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import { useGetCountries } from "hooks/countries-hooks";
import { useGetCurrencies } from "hooks/currencies-hooks";
import { useGetLanguages } from "hooks/languages-hooks";
import { useGetReferrals } from "hooks/referrals-hooks";
import { useGetSecurityQuestion } from "hooks/security-questions-hooks";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getCmsConfigAccounts,
  getCmsConfigBetting,
  getCmsConfigBrandDetails,
  getCmsConfigIsLoading,
} from "redux/reselect/cms-selector";
import { getAccountFields } from "utils/account-profile";

import CentralCarousel from "../../../common/components/CentralCarousel";
import CentralIFrame from "../../../common/components/CentralIFrame";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const propTypes = {};
const defaultProps = {};

const AccountCreatePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const countries = useGetCountries(dispatch);
  const currencies = useGetCurrencies(dispatch);
  const referrals = useGetReferrals(dispatch);
  const securityQuestions = useGetSecurityQuestion(dispatch);
  const languages = useGetLanguages(dispatch);

  const cmsConfigIsLoading = useSelector(getCmsConfigIsLoading);
  const cmsConfigAccounts = useSelector(getCmsConfigAccounts);
  const {
    data: { fields, registrationMode },
  } = cmsConfigAccounts || { data: {} };

  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);
  const {
    data: { defaultCountry, defaultCurrency, defaultLanguage },
  } = cmsConfigBrandDetails || { data: {} };

  const cmsConfigBetting = useSelector(getCmsConfigBetting);
  const {
    data: { defaultPriceFormat, priceFormats },
  } = cmsConfigBetting || { data: {} };

  return (
    <div className={`${classes["main"]} ${classes["main_edit-profile"]}`}>
      <CentralCarousel />
      <CentralIFrame />
      <h1 className={classes["main__label"]}>{t("create_profile")}</h1>
      <div className={classes["main__edit-profile"]}>
        {cmsConfigIsLoading ? (
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
        ) : (
          <AccountCreateForm
            buttonLabel={t("create_account")}
            countries={countries}
            currencies={currencies}
            defaultCountry={defaultCountry}
            defaultCurrency={defaultCurrency}
            defaultLanguage={defaultLanguage}
            defaultPriceFormat={defaultPriceFormat}
            fields={getAccountFields({ fields, registrationMode })}
            languages={languages}
            priceFormats={priceFormats}
            referrals={referrals}
            securityQuestions={securityQuestions}
          />
        )}
      </div>
    </div>
  );
};

AccountCreatePage.propTypes = propTypes;
AccountCreatePage.defaultProps = defaultProps;

export default AccountCreatePage;
