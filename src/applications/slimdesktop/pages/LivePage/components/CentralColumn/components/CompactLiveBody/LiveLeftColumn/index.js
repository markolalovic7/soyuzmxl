import cx from "classnames";
import PropTypes from "prop-types";

import { isNotEmpty } from "../../../../../../../../../utils/lodash";
import classes from "../../../../../../../scss/slimdesktop.module.scss";
import LeagueContent from "../LeagueContent";

const LiveLeftColumn = ({ sportData, sports }) => (
  <div className={cx(classes["content-col--half"], classes["content-col--half_special"])}>
    {Object.entries(sportData).map((entry) => {
      const sport = entry[0];
      const leagues = Object.entries(entry[1]);

      return (
        <>
          <div className={cx(classes["box-title"], classes["box-title--with-icon"])} key={sport}>
            <span className={cx(classes["qicon-default"], classes[`qicon-${sport.toLowerCase()}`], classes["icon"])} />
            {isNotEmpty(sports) && sport ? sports[sport].description : ""}
          </div>

          <div className={classes["content__box-1"]} style={{ padding: "0px 10px 10px 10px" }}>
            {leagues.map((leagueEntry) => {
              const leagueDescription = leagueEntry[0];
              const leagueMatches = leagueEntry[1];

              return (
                <LeagueContent
                  key={leagueDescription}
                  leagueDescription={leagueDescription}
                  leagueMatches={leagueMatches}
                  sportCode={sport}
                />
              );
            })}
          </div>
        </>
      );
    })}
  </div>
);

const propTypes = {
  sportData: PropTypes.object.isRequired,
  sports: PropTypes.array.isRequired,
};

LiveLeftColumn.propTypes = propTypes;

export default LiveLeftColumn;
