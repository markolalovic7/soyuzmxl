import cx from "classnames";
import PropTypes from "prop-types";

import { isNotEmpty } from "../../../../../../../../utils/lodash";
import classes from "../../../../../../scss/slimdesktop.module.scss";
import LeagueContent from "../CompactLiveBody/LeagueContent";

const RegularLiveBody = ({ sportData, sports }) => (
  <div className={classes["content__cols"]}>
    <div className={classes["content-col--full"]}>
      {Object.entries(sportData).map((entry) => {
        const sport = entry[0];
        const leagues = Object.entries(entry[1]);

        return (
          <>
            <div className={cx(classes["box-title"], classes["box-title--with-icon"])} key={sport}>
              <span
                className={cx(classes["qicon-default"], classes[`qicon-${sport.toLowerCase()}`], classes["icon"])}
              />
              {isNotEmpty(sports) && sport ? sports[sport].description : ""}
            </div>

            <div className={classes["content__box-1"]}>
              {leagues.map((leagueEntry) => {
                const leagueDescription = leagueEntry[0];
                const leagueMatches = leagueEntry[1];

                return (
                  <LeagueContent
                    isAllowInlineDetailExpansion
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
  </div>
);

const propTypes = {
  sportData: PropTypes.object.isRequired,
  sports: PropTypes.array.isRequired,
};

RegularLiveBody.propTypes = propTypes;

export default RegularLiveBody;
