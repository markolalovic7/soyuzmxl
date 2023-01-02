import { Link, withRouter } from "react-router-dom";

import { ReactComponent as BreadcrumbSVG } from "../../../img/icons/breadcrumb.svg";
import classes from "../../../scss/citywebstyle.module.scss";

const PagePath = (props) => (
  <div className={`${classes["breadcrumbs"]} ${props.qualifierClassName ? classes[props.qualifierClassName] : ""}`}>
    <div className={classes["breadcrumbs__return"]} onClick={() => props.history.goBack()}>
      <BreadcrumbSVG />
    </div>
    <div className={classes["breadcrumbs__body"]}>
      {props.paths.map((path, index) => {
        const firstItem = index === 0;
        const lastItem = index === props.paths.length - 1;

        if (firstItem) {
          return (
            <Link className={`${classes["breadcrumbs__item"]}`} key={index} to={path.target}>
              {path.description}
            </Link>
          );
        }
        if (!lastItem) {
          if (path.target) {
            return (
              <Link className={`${classes["breadcrumbs__item"]}`} key={index} to={path.target}>
                <span /> {path.description}
              </Link>
            );
          }

          return (
            <div className={`${classes["breadcrumbs__item"]}`} key={index}>
              <span /> {path.description}
            </div>
          );
        }

        return (
          <div className={`${classes["breadcrumbs__item"]}`} key={index}>
            <span /> {path.description}
          </div>
        );
      })}
    </div>
  </div>
);

export default withRouter(PagePath);
