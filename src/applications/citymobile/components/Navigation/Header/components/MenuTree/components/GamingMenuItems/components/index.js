import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import ExternalMenuItemLink from "../../ExternalMenuItemLink";

const GamingMenuItems = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <>
      <ExternalMenuItemLink
        bold
        label={t("casino")}
        path={process.env.REACT_APP_HITBET_CASINO_URL}
        subLabel={t("play_now")}
        onClick={onClick}
      />

      <ExternalMenuItemLink
        bold
        label={t("live_casino")}
        path={process.env.REACT_APP_HITBET_LIVE_CASINO_URL}
        subLabel={t("play_now")}
        onClick={onClick}
      />

      <ExternalMenuItemLink
        bold
        label={t("hb.promos")}
        path={process.env.REACT_APP_HITBET_PROMOTIONS_URL}
        subLabel={t("see_all")}
        onClick={onClick}
      />

      <ExternalMenuItemLink
        bold
        label={t("game")}
        path={process.env.REACT_APP_HITBET_GAME_URL}
        subLabel={t("play_now")}
        onClick={onClick}
      />

      <ExternalMenuItemLink
        bold
        label={t("graph_game")}
        path={process.env.REACT_APP_HITBET_GRAPH_GAME_URL}
        subLabel={t("play_now")}
        onClick={onClick}
      />
    </>
  );
};

GamingMenuItems.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default GamingMenuItems;
