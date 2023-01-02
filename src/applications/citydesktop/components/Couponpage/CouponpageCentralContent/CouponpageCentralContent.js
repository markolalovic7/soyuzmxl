import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import classes from "../../../scss/citywebstyle.module.scss";

import CouponPageContent from "./CouponpageCentralContent/CouponPageContent";

const CouponpageCentralContent = (props) => {
  const [eventPathIds, setEventPathIds] = useState(props.eventPathIds);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.eventPathIds) {
      setEventPathIds(props.eventPathIds);
    }
  }, [props.eventPathIds]);

  return (
    <section className={classes["content"]}>
      <CouponPageContent eventPathIds={eventPathIds} sportCode={props.sportCode} />
    </section>
  );
};

export default React.memo(CouponpageCentralContent);
