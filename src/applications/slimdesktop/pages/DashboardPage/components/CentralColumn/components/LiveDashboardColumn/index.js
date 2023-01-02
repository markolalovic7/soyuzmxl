import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import LeagueContent from "../../../../../LivePage/components/CentralColumn/components/CompactLiveBody/LeagueContent";

const LiveDashboardColumn = ({ sportData, sports }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["content-col--half"]}>
      <div className={classes["box-title"]}>{t("live")}</div>

      {Object.entries(sportData).map((entry) => {
        const sport = entry[0];
        const leagues = Object.entries(entry[1]);

        return (
          <div className={classes["content__box-1"]}>
            {leagues.map((leagueEntry) => {
              const leagueDescription = leagueEntry[0];
              const leagueMatches = leagueEntry[1];

              return (
                <LeagueContent
                  key={leagueDescription}
                  leagueDescription={undefined}
                  leagueMatches={leagueMatches}
                  sportCode={sport}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const propTypes = {
  sportData: PropTypes.object.isRequired,
  sports: PropTypes.array.isRequired,
};

LiveDashboardColumn.propTypes = propTypes;

export default LiveDashboardColumn;
