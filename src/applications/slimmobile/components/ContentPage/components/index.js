/* eslint-disable react/no-danger */
import axios from "axios";
import isEmpty from "lodash.isempty";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { getPageContent } from "redux/actions/page-content-actions";

import CentralCarousel from "../../../common/components/CentralCarousel";
import classes from "../styles/index.module.scss";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const renderContent = () => {
    if (contentIsFetching && isEmpty(contentData)) {
      return (
        <div className={classes["section-loader-wrapper"]}>
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
        </div>
      );
    }

    if (isEmpty(contentData)) {
      return <div>{t("slimmobile.pages.page_content.page_content_empty")}</div>;
    }
    const { description, richText } = contentData;

    return (
      <div className={classes["page-content-wrapper"]}>
        <h1 className={classes["page-content-title"]}>{description}</h1>
        <div className={classes["content"]} dangerouslySetInnerHTML={{ __html: richText }} />
      </div>
    );
  };

  return (
    <div className={classes["wrapper"]}>
      <CentralCarousel />
      {renderContent()}
    </div>
  );
};

export default ContentPage;
