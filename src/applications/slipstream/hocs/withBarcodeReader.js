import { useHistory } from "react-router";

import BarcodeScanner from "../utils/BarcodeScanner";

const withBarcodeReader = (Component) => (props) => {
  const history = useHistory();

  const handleScan = (data) => {
    console.log(`Scanned betslip reference scanned: ${data}`);

    history.push(`/loadticket/${data}`);
  };

  const handleError = (err) => {
    console.log(`Scan error (likely to be regular keyboard input out of a HTML input): ${err}`);
  };

  return (
    <>
      <BarcodeScanner
        onError={handleError}
        onScan={handleScan}
        // scanButtonKeyCode={113}
      />
      <Component {...props} />
    </>
  );
};

export default withBarcodeReader;
