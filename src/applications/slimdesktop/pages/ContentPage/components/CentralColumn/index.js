import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import axios from "axios";
import cx from "classnames";
import isEmpty from "lodash.isempty";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { getPageContent } from "../../../../../../redux/actions/page-content-actions";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CentralColumn = () => {
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

  if (contentIsFetching && isEmpty(contentData)) {
    return <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />;
  }

  return (
    <div className={classes["content__main"]}>
      <div className={classes["content__menu"]}>
        <nav className={classes["content__menu-items"]}>
          <div className={cx(classes["content__menu-link"], classes["content__menu-link_active"])}>{description}</div>
        </nav>
      </div>

      <div className={classes["content-full"]}>
        <div className={classes["page-content"]}>
          <div className={classes["page-content-body"]} dangerouslySetInnerHTML={{ __html: richText }} />
        </div>
      </div>
    </div>
  );
};

export default CentralColumn;
