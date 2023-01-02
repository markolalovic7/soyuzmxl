import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import axios from "axios";
import isEmpty from "lodash.isempty";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { getPageContent } from "../../../../../redux/actions/page-content-actions";

const ContentPage = () => {
  const { pageContentId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [contentData, setContentData] = useState([]);
  const [contentIsFetching, setContentIsFetching] = useState(true);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchTransactions = async () => {
      const action = await dispatch(
        getPageContent({
          cancelToken: source.token,
          pageContentId,
        }),
      );
      if (getPageContent.fulfilled.match(action)) {
        setContentIsFetching(false);
        setContentData(action.payload.contentData);

        return;
      }
      setContentIsFetching(false);
      setContentData([]);
    };

    fetchTransactions();

    return () => {
      source.cancel();
    };
  }, [dispatch, pageContentId]);

  const { description, richText } = contentData;

  return (
    <main className={classes["main"]} style={{ display: "block", overflow: "auto" }}>
      <div className={classes["calendar__wrapper"]}>
        <section className={classes["calendar__wrapper-content"]}>
          {contentIsFetching && isEmpty(contentData) && (
            <div style={{ left: "0", position: "fixed", textAlign: "center", top: "300px", width: "100%" }}>
              <FontAwesomeIcon className="fa-spin" icon={faSpinner} size="lg" />
            </div>
          )}
          {!contentIsFetching && (
            <div className={classes["page-content"]}>
              <div className={classes["page-content-title"]}>{description}</div>
              <div className={classes["page-content-body"]} dangerouslySetInnerHTML={{ __html: richText }} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default React.memo(ContentPage);
