import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import axios from "axios";
import cx from "classnames";
import isEmpty from "lodash.isempty";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { getPageContent } from "../../../../../../redux/actions/page-content-actions";
import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import CentralColumnWidgets from "../../../../components/CentralColumnWidgets";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CentralColumn = () => {
  const { pageContentId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [contentData, setContentData] = useState([]);
  const [contentIsFetching, setContentIsFetching] = useState(true);

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

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
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["central-section__content"]}>
        <CentralColumnWidgets />
        {contentIsFetching && isEmpty(contentData) && (
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
        )}
        {!contentIsFetching && (
          <div className={classes["page-content"]}>
            <div className={classes["page-content-title"]}>{description}</div>
            <div className={classes["page-content-body"]} dangerouslySetInnerHTML={{ __html: richText }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CentralColumn;
