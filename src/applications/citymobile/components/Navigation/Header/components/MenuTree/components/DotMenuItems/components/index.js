import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import ExternalMenuItemLink from "../../ExternalMenuItemLink";
import RegularMenuItemLink from "../../RegularMenuItemLink";

const DotMenuItems = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <>
      <RegularMenuItemLink bold label={t("results")} path="/results" onClick={onClick} />
      <ExternalMenuItemLink
        bold
        inner
        label={t("live_results")}
        path={process.env.REACT_APP_HITBET_LIVE_RESULTS_URL}
        onClick={onClick}
      />
      <ExternalMenuItemLink
        bold
        label={t("hb.promos")}
        path={process.env.REACT_APP_HITBET_PROMOTIONS_URL}
        onClick={onClick}
      />
      <RegularMenuItemLink bold label={t("settings")} path="/settings" onClick={onClick} />
      <ExternalMenuItemLink
        bold
        label={t("terms_and_conditions")}
        path={process.env.REACT_APP_HITBET_TERMS_AND_CONDITIONS_URL}
        onClick={onClick}
      />
      <ExternalMenuItemLink
        bold
        label={t("contact_us")}
        path={process.env.REACT_APP_HITBET_CONTACT_US_URL}
        onClick={onClick}
      />
    </>
  );
};

DotMenuItems.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default DotMenuItems;
