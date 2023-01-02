import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useOnClickOutside } from "hooks/utils-hooks";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getAuthIsIframe } from "../../../../../../../../../../../redux/reselect/auth-selector";

import CheckboxInput from "./CheckboxInput";

const propTypes = {
  excludedTournaments: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setExcludedTournaments: PropTypes.func.isRequired,
  tournaments: PropTypes.array.isRequired,
};

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const LeaguePopup = ({ excludedTournaments, isOpen, onClose, setExcludedTournaments, tournaments }) => {
  const { t } = useTranslation();
  const isInIframe = useSelector(getAuthIsIframe);

  const modalRef = useRef();

  useOnClickOutside(modalRef, onClose);

  const toggleCheckbox = (e, tournamentId) => {
    e.stopPropagation();
    if (!excludedTournaments.includes(tournamentId)) {
      setExcludedTournaments([...excludedTournaments, tournamentId]);
    } else {
      const index = excludedTournaments.indexOf(tournamentId);
      if (index > -1) {
        const updatedExcludedTournaments = [...excludedTournaments];
        updatedExcludedTournaments.splice(index, 1);
        setExcludedTournaments(updatedExcludedTournaments);
      }
    }
  };

  const deselectAllHandler = () => {
    tournaments.forEach((tournament) => {
      if (!excludedTournaments.includes(tournament.id)) {
        setExcludedTournaments((prevExcludedTournaments) => [...prevExcludedTournaments, tournament.tournamentId]);
      }
    });
  };

  const selectAllHandler = () => {
    setExcludedTournaments([]);
  };

  return (
    <div
      className={cx(
        classes["popup-league"],
        classes["popup"],
        { [classes["popup_special"]]: isInIframe },
        {
          [classes["open"]]: isOpen,
        },
      )}
      id="popup-league"
    >
      <div className={classes["popup__body"]}>
        <div className={cx(classes["popup__content"], classes["popup-league__content"])} ref={modalRef}>
          <div className={classes["popup-league__header"]}>
            <h2 className={classes["popup-league__title"]}>{t("vanilladesktop.select_league")}</h2>
            <span className={cx(classes["popup-league__close"], classes["close-popup"])} onClick={onClose} />
          </div>
          <div className={classes["popup-league__filters"]}>
            <div className={cx(classes["popup-league__filter"], classes["select-all"])} onClick={selectAllHandler}>
              <div className={classes["popup-league__icon"]}>
                <svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <g>
                      <path d="M16.53 6.06L15.47 5l-4.88 4.88-2.12-2.12-1.06 1.06L10.59 12zM14 18H2V5H0v13a2 2 0 0 0 2 2h12zm-8-4V2h12v12zM6 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    </g>
                  </g>
                </svg>
              </div>
              <span className={classes["popup-league__label"]}>{t("vanilladesktop.select_all")}</span>
            </div>
            <div className={cx(classes["popup-league__filter"], classes["deselect-all"])} onClick={deselectAllHandler}>
              <div className={classes["popup-league__icon"]}>
                <svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <g>
                      <path d="M14 18v2H2a2 2 0 0 1-2-2V5h2v13zm4-2H6a2 2 0 0 1-2-2V2c0-1.11.89-2 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2zm0-14H6v12h12z" />
                    </g>
                  </g>
                </svg>
              </div>
              <span className={classes["popup-league__label"]}>{t("vanilladesktop.deselect_all")}</span>
            </div>
          </div>
          <div className={classes["popup-league__checkboxes"]}>
            {tournaments.map((tournament) => {
              const pathDescription = `${tournament.categoryDescription} : ${tournament.tournamentDescription}`;

              return (
                <CheckboxInput
                  checked={!excludedTournaments.includes(tournament.tournamentId)}
                  id={`popup-login__checkbox_${tournament.tournamentId}`}
                  key={tournament.tournamentId}
                  label={pathDescription}
                  name={`popup-login__checkbox_${tournament.tournamentId}`}
                  onChange={(e) => toggleCheckbox(e, tournament.tournamentId)}
                />
              );
            })}
          </div>
          <div className={classes["popup-league__buttons"]} onClick={onClose}>
            <span className={cx(classes["popup-league__save"], classes["close-popup"])}>{t("save")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

LeaguePopup.propTypes = propTypes;

export default React.memo(LeaguePopup);
