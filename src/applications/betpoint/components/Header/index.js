import { faSyncAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getSymbolFromCurrency from "currency-symbol-map";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getBalance } from "../../../../redux/reselect/balance-selector";
import { formatDateMonthYearShortDayHour } from "../../../../utils/dayjs-format";
import Demobet from "../../img/demobet.png";
import classes from "../../scss/betpoint.module.scss";

const Header = () => {
  const balance = useSelector(getBalance);
  const currencyCode = useSelector((state) => state.auth?.currencyCode);
  const username = useSelector((state) => state.auth?.username);

  const [date, setDate] = useState(formatDateMonthYearShortDayHour(dayjs()));

  useEffect(() => {
    const id = setInterval(() => {
      setDate(formatDateMonthYearShortDayHour(dayjs()));
    }, 1000);

    return () => clearInterval(id);
  });

  return (
    <div className={classes["header"]}>
      <div className={classes["header__logo"]}>
        <img alt="" src={Demobet} />
      </div>
      <div className={classes["header__top"]}>
        <div className={classes["header__greetings"]}>{`Hi, ${username}`}</div>
        <div className={classes["header-balance"]}>
          <div className={classes["header-balance__icon"]}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className={classes["header-balance__text"]}>
            <div className={classes["header-balance__title"]}>Balance:</div>
            {balance && (
              <div className={classes["header-balance__money"]}>
                {`${getSymbolFromCurrency(currencyCode)} ${balance.availableBalance.toLocaleString()}`}
              </div>
            )}
          </div>
          <div className={classes["header-balance__icon"]}>
            <FontAwesomeIcon icon={faSyncAlt} />
          </div>
        </div>
      </div>
      <div className={classes["header__bottom"]}>
        <div className={classes["header__date"]}>{date}</div>
      </div>
    </div>
  );
};

export default Header;
