import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

// https://usehooks.com/useWindowSize/
// https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
// https://medium.com/@ariel.salem1989/communicating-with-iframes-712fdc2b4d14

export const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowHeight, setWindowHeight] = useState(undefined);
  const [windowWidth, setWindowWidth] = useState(undefined);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize(height, width) {
      setWindowWidth(width);
      setWindowHeight(height);
    }

    // create an Observer instance
    const resizeObserver = new ResizeObserver((entries) => {
      // console.log("Body client height changed:", entries[0].target.clientHeight);
      // console.log("Body scroll height changed:", entries[0].target.scrollHeight);
      // console.log("Body client width changed:", entries[0].target.clientWidth);
      // console.log("Body scroll width changed:", entries[0].target.scrollWidth);

      const target = entries[0].target;
      // const height = Math.max(target.clientHeight, target.scrollHeight);
      // const width = Math.max(target.clientWidth, target.scrollWidth);
      const height = Math.max(target.scrollHeight);
      const width = Math.max(target.scrollWidth);
      handleResize(height, width);
    });

    // start observing a DOM node
    resizeObserver.observe(document.body);

    // We cannot trust ResizeObserver, as it tracks the client height/width, not the scroll height. So it only fires up when the user resizes the browser...
    // Here, we will check periodically and fire out manually when required...
    const intervalId = setInterval(() => {
      // const height = Math.max(document.body.clientHeight, document.body.scrollHeight);
      // const width = Math.max(document.body.clientWidth, document.body.scrollWidth);
      const root = document.getElementById("root");
      // console.log(`Client Height: ${root.clientHeight}`);
      // console.log(`Scroll Height: ${root.scrollHeight}`);
      const height = Math.max(root.clientHeight, root.scrollHeight);
      const width = Math.max(root.clientWidth, root.scrollWidth);
      handleResize(height, width);
    }, 100);

    return () => clearInterval(intervalId);
  }, []); // Empty array ensures that effect is only run on mount

  useEffect(() => {
    window.parent.postMessage(
      {
        action: "app.iframe_resize",
        height: windowHeight,
        width: windowWidth,
      },
      "*",
    );
  }, [windowHeight, windowWidth]);

  return [windowHeight, windowWidth];
};
