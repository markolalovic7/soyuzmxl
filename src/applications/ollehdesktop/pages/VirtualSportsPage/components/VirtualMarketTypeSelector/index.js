import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useOnClickOutside } from "../../../../../../hooks/utils-hooks";
import classes from "../../../../scss/ollehdesktop.module.scss";
import { MARKET_TYPE_GROUPS } from "../../constants";

const propTypes = {
  marketTypeGroupSelection: PropTypes.string,
  setMarketTypeGroupSelection: PropTypes.func.isRequired,
};
const defaultProps = {
  marketTypeGroupSelection: undefined,
};

const VirtualMarketTypeSelector = ({ marketTypeGroupSelection, setMarketTypeGroupSelection }) => {
  const { t } = useTranslation();

  const [isOpened, setIsOpened] = useState(false);
  const viewTypeRef = useRef();

  useOnClickOutside(viewTypeRef, () => setIsOpened(false));

  return (
    <div
      className={`${classes["header__navigation-numbers"]} ${isOpened ? classes["active"] : ""}`}
      ref={viewTypeRef}
      onClick={() => setIsOpened((value) => !value)}
    >
      <ul className={classes["default-option"]}>
        <li>
          <div className={classes["option"]}>
            <span>
              {t("market")}
              :&nbsp;
            </span>
            {marketTypeGroupSelection
              ? t(MARKET_TYPE_GROUPS.find((m) => m.code === marketTypeGroupSelection).translationKey)
              : t("all")}
          </div>
        </li>
      </ul>
      <ul className={classes["dropdown"]} style={{ minWidth: "120px" }}>
        {MARKET_TYPE_GROUPS?.map((type) => (
          <li key={type.code} onClick={() => setMarketTypeGroupSelection(type.code)}>
            <div className={`${classes["option"]}`}>{t(type.translationKey)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

VirtualMarketTypeSelector.propTypes = propTypes;
VirtualMarketTypeSelector.defaultProps = defaultProps;

export default VirtualMarketTypeSelector;
