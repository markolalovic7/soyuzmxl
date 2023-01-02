import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AccountEditForm from "applications/vanillamobile/common/components/AccountEditForm";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { useGetLanguages } from "hooks/languages-hooks";
import { getAccountSelector } from "redux/reselect/account-selector";
import { getAuthSelector } from "redux/reselect/auth-selector";
import { getCmsConfigBetting, getCmsSelector } from "redux/reselect/cms-selector";
import { loadAccountData } from "redux/slices/accountSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {};
const defaultProps = {};

const AccountEditPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { lineId, loading: cmsConfigIsLoading, originId } = useSelector(getCmsSelector);
  const { accountId, authToken, language } = useSelector(getAuthSelector);
  const languages = useGetLanguages(dispatch);

  const cmsConfigBetting = useSelector(getCmsConfigBetting);

  const {
    data: { priceFormats },
  } = cmsConfigBetting || { data: {} };

  useEffect(() => {
    if (accountId && authToken && language && lineId && originId) {
      dispatch(loadAccountData({ accountId, authToken, language, lineId, originId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
  const { accountData, loading: accountIsLoading } = useSelector(getAccountSelector);

  const {
    address,
    city,
    countryCode,
    currencyCode,
    dob,
    email,
    firstName,
    gender,
    identityDocument,
    languageCode,
    lastName,
    mobile,
    postcode,
    priceFormat,
    username,
  } = accountData || {};

  return (
    <div className={classes["main"]}>
      <h1 className={classes["main__title"]}>{t("edit_profile")}</h1>
      <div className={classes["form__container"]}>
        <div className={classes["form"]}>
          <h2 className={classes["form__title"]}>{t("personal_details")}</h2>
          <div className={classes["form__container"]}>
            {!accountData && (cmsConfigIsLoading || accountIsLoading) ? (
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
            ) : (
              <AccountEditForm
                accountId={accountId}
                address={address}
                buttonLabel={t("update_account")}
                city={city}
                countryCode={countryCode}
                currencyCode={currencyCode}
                defaultLanguage={languageCode}
                defaultPriceFormat={priceFormat}
                dob={dob}
                email={email}
                firstName={firstName}
                gender={gender}
                identityDocument={identityDocument}
                languages={languages}
                lastName={lastName}
                mobile={mobile}
                postcode={postcode}
                priceFormats={priceFormats}
                userName={username}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

AccountEditPage.propTypes = propTypes;
AccountEditPage.defaultProps = defaultProps;

export default AccountEditPage;
