import SelectableCoefficient from "applications/vanilladesktop/components/SelectableCoeficient/components";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getAuthLanguage, getAuthLoggedIn } from "../../../../../../redux/reselect/auth-selector";
import { getCmsConfigSportsBook } from "../../../../../../redux/reselect/cms-selector";
import { openLinkInNewWindow } from "../../../../../../utils/misc";
import FavouriteMatchButton from "../../../../components/FavouriteMatchButton";

const CompactTicket = ({ onSelect, selected, ticket }) => {
  const isLoggedIn = useSelector(getAuthLoggedIn);
  const language = useSelector(getAuthLanguage);

  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;

  return (
    <div
      className={cx(classes["ticket"], { [classes["active"]]: selected })}
      onClick={(e) => {
        if (e.target === e.currentTarget) onSelect(ticket.eventId);
      }}
    >
      <h3 className={classes["ticket__title"]}>{ticket.label}</h3>
      <div className={classes["ticket__information"]}>
        <span className={classes["ticket__time"]}>{ticket.date}</span>
        <div className={classes["ticket__icons"]}>
          {betradarStatsOn && betradarStatsURL && ticket.feedCode && (
            <div
              className={classes["ticket__icon"]}
              onClick={() => openLinkInNewWindow(`${betradarStatsURL}/${language}/match/${ticket.feedCode}`)}
            >
              <i className={classes["qicon-stats"]} />
            </div>
          )}

          {isLoggedIn && <FavouriteMatchButton isDiv className="ticket__icon" eventId={ticket.eventId} />}

          <div className={classes["ticket__icon"]}>
            <i className={classes["qicon-sms-bet"]} />
          </div>
          <div
            className={cx(classes["ticket__icon"], classes["ticket-activator"])}
            onClick={() => onSelect(ticket.eventId)}
          >
            <span>{ticket.code}</span>
          </div>
        </div>
      </div>
      <div className={classes["ticket__coeficients"]}>
        {ticket.coefficients.map((item) => (
          <SelectableCoefficient
            desc={item.desc}
            dir={item.dir}
            eventId={ticket.eventId}
            hidden={item.hidden}
            key={item.outcomeId}
            outcomeId={item.outcomeId}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

CompactTicket.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  ticket: PropTypes.shape({
    code: PropTypes.string.isRequired,
    coefficients: PropTypes.arrayOf(
      PropTypes.shape({
        coefficient: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ).isRequired,
    date: PropTypes.string.isRequired,
    eventId: PropTypes.number.isRequired,
    feedCode: PropTypes.string,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default CompactTicket;
