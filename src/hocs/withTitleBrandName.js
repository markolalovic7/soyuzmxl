import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { getCmsConfigBrandName } from "redux/reselect/cms-selector";

const withTitleBrandName = (Component) => (props) => {
  const brandName = useSelector(getCmsConfigBrandName);

  return (
    <>
      <Helmet>
        <title>{brandName}</title>
      </Helmet>
      <Component {...props} />
    </>
  );
};

export default withTitleBrandName;
