import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import classes from "../../../scss/citywebstyle.module.scss";

import CountryPageContent from "./CountrypageCentralContent/CountryPageContent";

const CountrypageCentralContent = (props) => {
  const [activeEventPathId, setActiveEventPathId] = useState(props.eventPathId);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.eventPathId) {
      setActiveEventPathId(props.eventPathId);
    }
  }, [props.eventPathId]);

  return (
    <section className={classes["content"]}>
      <CountryPageContent activeEventPathId={activeEventPathId} sportCode={props.sportCode} />
    </section>
  );
};

export default React.memo(CountrypageCentralContent);
