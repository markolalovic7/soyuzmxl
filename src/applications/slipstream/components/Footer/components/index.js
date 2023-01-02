import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getAuthTill, getAuthUsername } from "../../../../../redux/reselect/auth-selector";
import { getRetailTillDetails } from "../../../../../redux/reselect/retail-selector";
import { formatDateMonthYearShortDayHour } from "../../../../../utils/dayjs-format";
import classes from "../../../scss/slipstream.module.scss";

const Footer = () => {
  const [date, setDate] = useState(formatDateMonthYearShortDayHour(dayjs()));

  const authUsername = useSelector(getAuthUsername);
  const authTill = useSelector(getAuthTill);
  const balance = useSelector((state) => state.retailTill.balance);
  const tillDetails = useSelector(getRetailTillDetails);
  const currencyCode = tillDetails?.currencyCode;

  useEffect(() => {
    const id = setInterval(() => {
      setDate(formatDateMonthYearShortDayHour(dayjs()));
    }, 1000);

    return () => clearInterval(id);
  });

  return (
    <div className={classes["footer"]}>
      <div className={classes["footer__info"]}>
        <div className={classes["footer__description"]} />
        {tillDetails &&
          `Shop: ${tillDetails.shopDescription} | Till: ${
            tillDetails.tillDescription
          } [${authTill}] | User: ${authUsername} | Balance: ${currencyCode} ${balance?.toLocaleString()} `}
        <button className={classes["footer__refresh"]} style={{ marginLeft: "10px" }}>
          <FontAwesomeIcon icon={faSyncAlt} />
        </button>
      </div>
      <div className={classes["footer__date"]}>{date}</div>
    </div>
  );
};

export default React.memo(Footer);
