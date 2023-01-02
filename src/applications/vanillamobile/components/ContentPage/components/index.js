/* eslint-disable react/no-danger */
import axios from "axios";
import isEmpty from "lodash.isempty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import classes from "../styles/index.module.scss";

import ContentCarousel from "./ContentCarousel";

import SectionLoader from "applications/vanillamobile/common/components/SectionLoader";
import SectionNoData from "applications/vanillamobile/common/components/SectionNoData";
import { getPageContent } from "redux/actions/page-content-actions";

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
      return <SectionLoader />;
    }

    if (isEmpty(contentData)) {
      return <SectionNoData title={t("vanillamobile.pages.page_content.page_content_empty")} />;
    }
    const { description, richText } = contentData;

    return (
      <div className={classes["page-content-wrapper"]}>
        <h1 className={classes["main__title"]}>{description}</h1>
        <div className={classes["content"]} dangerouslySetInnerHTML={{ __html: richText }} />
      </div>
    );
  };

  return (
    <div className={classes["wrapper"]}>
      <ContentCarousel />
      {renderContent()}
    </div>
  );
};

export default ContentPage;
