import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

import { useOnClickOutside } from "../../../../../../../../hooks/utils-hooks";
import CountryExpandingMatches from "../CountryExpandingMatches";

const propTypes = {
  bgClassName: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  countries: PropTypes.array.isRequired,
  isTabletVersionExpanded: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onExpand: PropTypes.func.isRequired,
  onSelectMatch: PropTypes.func.isRequired,
};

const SideBarExpandingSport = ({
  bgClassName,
  count,
  countries,
  isTabletVersionExpanded,
  label,
  onExpand,
  onSelectMatch,
}) => {
  const itemRef = useRef();
  const [tabletExpandedPanelTopStyle, setTabletExpandedPanelTopStyle] = useState(0);
  const [isDesktopVersionExpanded, setIsDesktopVersionExpanded] = useState(true);

  // On desktop there can be multiple expanded panels at once. This component controls its open state.
  const handleDesktopSportExpanding = () => {
    if (window.innerWidth >= 1201) {
      setIsDesktopVersionExpanded((isExpanded) => !isExpanded);
    }
  };

  // On tablet there can be only one expanded panel at once. Which panel is shown is controlled by parent component.
  const handleTabletExpanding = () => {
    setTabletExpandedPanelTopStyle(itemRef.current.getBoundingClientRect().y - 83);
    onExpand(label);
  };

  // Close tablet opened panel to prevent styles conflicts between desktop's and tablet's expanded versions.
  // ("position: absolute" is used only for tablet version)
  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth >= 1201 && isTabletVersionExpanded) {
        onExpand("");
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, [isTabletVersionExpanded, onExpand]);

  useOnClickOutside(itemRef, () => onExpand(""));

  return (
    <div className={classes["live__item-wrapper"]}>
      <div
        className={cx(classes["live__item--tb"], { [classes["active"]]: isTabletVersionExpanded })}
        ref={itemRef}
        onClick={handleTabletExpanding}
      >
        <span className={cx(classes["qicon-default"], classes[`qicon-${bgClassName}`], classes["icon"])} />
        <span className={classes["live__item-title"]}>{label}</span>
        <span className={classes["live__item-count-sm"]}>{count}</span>
      </div>
      <div
        className={cx(classes["live__item--large"], { [classes["open"]]: isTabletVersionExpanded })}
        style={{ top: tabletExpandedPanelTopStyle }}
      >
        <div
          className={cx(classes["live__item"], classes[bgClassName], {
            [classes["active"]]: isDesktopVersionExpanded || isTabletVersionExpanded,
          })}
          onClick={handleDesktopSportExpanding}
        >
          <span className={classes["live__item-chevron"]}>
            <FontAwesomeIcon icon={faChevronRight} />
          </span>
          <span className={classes["live__item-title"]}>{label}</span>
          <span className={classes["live__item-count"]}>{`(${count})`}</span>
        </div>
        <div className={cx(classes["live__item-content"], { [classes["open"]]: isDesktopVersionExpanded })}>
          {countries.map((country) => (
            <CountryExpandingMatches
              countryCode={country.countryCode}
              countryName={country.countryName}
              key={country.countryName}
              matches={country.matches}
              onSelectMatch={onSelectMatch}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

SideBarExpandingSport.propTypes = propTypes;

export default React.memo(SideBarExpandingSport);
