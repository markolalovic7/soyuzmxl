import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectableCoefficient from "applications/vanilladesktop/components/SelectableCoeficient/components";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import SmsPopup from "../SmsPopup";
import { getCmsConfigSportsBook } from "../../../../redux/reselect/cms-selector";
import { useSelector } from "react-redux";

const getRows = (selections) => {
  const selectionsPerRow = selections.length % 2 === 0 ? 2 : 3;

  const rows = selections.reduce((result, value, index, array) => {
    if (index % selectionsPerRow === 0) result.push(array.slice(index, index + selectionsPerRow));

    return result;
  }, []);

  return rows;
};

const MatchDropdownPanel = ({ autoExpand, eventId, isCompact, label, markets }) => {
  const isSmsInfoEnabled = useSelector(getCmsConfigSportsBook)?.data?.smsInfoOn;

  const [isOpen, setIsOpen] = useState(autoExpand);

  useEffect(() => {
    if (autoExpand) {
      setIsOpen(autoExpand);
    }
  }, [autoExpand, setIsOpen]);

  const [isSmsPopupOpen, setIsSmsPopupOpen] = useState(false);

  const closeSmsPopup = useCallback(() => setIsSmsPopupOpen(false), []);

  return (
    <div className={cx(classes["match-spoiler"], { [classes["active"]]: isOpen })}>
      <div
        className={cx(classes["match-spoiler__body"], {
          [classes["active"]]: isOpen,
        })}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        <h3 className={classes["match-spoiler__title"]}>{label}</h3>
        {isCompact && (
          <span
            className={cx(classes["match-spoiler__info"], { [classes["active"]]: isOpen })}
            onClick={(e) => {
              e.stopPropagation();
              setIsSmsPopupOpen(true);
            }}
          >
            <i className={classes["qicon-sms-bet"]} />
          </span>
        )}
        {!isCompact && isSmsInfoEnabled && (
          <button
            className={cx(classes["popup-link"], classes["match-spoiler__help"])}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSmsPopupOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faQuestionCircle} />
          </button>
        )}
        <span className={cx(classes["match-spoiler__arrow"], { [classes["active"]]: isOpen })} />
      </div>
      <div
        className={cx(classes["match-spoiler__content"], {
          [classes["open"]]: isOpen,
        })}
      >
        {markets?.map((market) => {
          const rows = getRows(market.outcomes);

          return rows?.map((row, index) => (
            <div className={classes["match-spoiler__row"]} key={index}>
              {row?.map(({ desc, dir, hidden, id, price }, index) => (
                <SelectableCoefficient
                  desc={desc}
                  dir={dir}
                  eventId={eventId}
                  hidden={hidden || !market.open}
                  key={index}
                  outcomeId={id}
                  price={price}
                />
              ))}
            </div>
          ));
        })}
      </div>
      <SmsPopup isOpen={isSmsPopupOpen} onClose={closeSmsPopup} />
    </div>
  );
};

MatchDropdownPanel.propTypes = {
  autoExpand: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  isCompact: PropTypes.bool,
  label: PropTypes.string.isRequired,
  markets: PropTypes.array.isRequired,
};

MatchDropdownPanel.defaultProps = {
  isCompact: false,
};

export default React.memo(MatchDropdownPanel);
