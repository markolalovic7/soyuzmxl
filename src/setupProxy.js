const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Player API
  app.use(
    "/player",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: process.env.API || "http://p8cdev.lotus.local:8080/p8",
    }),
  );
  app.use(
    "/retail",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: process.env.API || "http://p8cdev.lotus.local:8080/p8",
    }),
  );

  // Live WebSocket (push)
  // Note - the context under createProxyMiddleware (first param) must be corrected (change of signature if upgrading to http-proxy-middleware v3.x)
  //              https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/context-matching.md
  // Context is required to prevent /ws (which is done by webpack hot-reload) being proxied to P8 and spamming errors in the logs
  app.use(
    // hack for the above - initialises the WS
    "/",
    createProxyMiddleware("/ws/live", {
      changeOrigin: true,
      secure: false,
      target: process.env.API,
      ws: true,
    }),
  );
  app.use(
    "/ws/live",
    createProxyMiddleware("/ws/live", {
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: process.env.API || "http://p8cdev.lotus.local:8080/p8",
      ws: true, // enable websocket proxy
    }),
  );
  // https://github.com/chimurai/http-proxy-middleware/issues/112
  // Currently to access /ws/live, first a GET http://localhost:3000/ws/live (over browser or any other way) is required to "warm up" the proxy?

  /**
   * BetRadar PRODUCTION Virtual Sport Proxies
   */
  // BetRadar Virtual Sports - Virtual Baseball (Production)
  app.use(
    "/vbi",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://${process.env.VBI_PROD_CLIENTID || "vbibetica"}.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Basketball (Production)
  app.use(
    "/vbl",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://${process.env.VBL_PROD_CLIENTID || "vblbetica"}.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Football Asian Cup (Production)
  app.use(
    "/vfas",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://${process.env.VF_PROD_CLIENTID || "vfbetica"}.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Football Championship Cup (Production)
  app.use(
    "/vfcc",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://${process.env.VF_PROD_CLIENTID || "vfbetica"}.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Football League (Production)
  app.use(
    "/vflm",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://${process.env.VF_PROD_CLIENTID || "vfbetica"}.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Football Nations Cup (Production)
  app.use(
    "/vfnc",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://${process.env.VF_PROD_CLIENTID || "vfbetica"}.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Football World Cup (Production)
  app.use(
    "/vfwc",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://${process.env.VF_PROD_CLIENTID || "vfbetica"}.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual In-Play Tennis (Production)
  app.use(
    "/vti",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://${process.env.VTI_PROD_CLIENTID || "vtibetica"}.aitcloud.de`,
    }),
  );

  /**
   * Betradar STAGING Virtual Sport Proxies
   */

  // BetRadar Virtual Sports - Virtual Baseball (Staging)
  app.use(
    "/vbistaging",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://vbistaging.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Basketball (Staging)
  app.use(
    "/vblstaging",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://vblstaging.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Football Asian Cup (Staging)
  app.use(
    "/vfasstaging",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://vfstaging.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Football Championship Cup (Staging)
  app.use(
    "/vfccstaging",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://vfstaging.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Football League (Staging)
  app.use(
    "/vflmstaging",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://vfstaging.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Football Nations Cup (Staging)
  app.use(
    "/vfncstaging",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://vfstaging.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual Football World Cup (Staging)
  app.use(
    "/vfwcstaging",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://vfstaging.aitcloud.de`,
    }),
  );

  // BetRadar Virtual Sports - Virtual In-Play Tennis (Staging)
  app.use(
    "/vtistaging",
    createProxyMiddleware({
      changeOrigin: true,
      // prependPath: true,
      logLevel: "debug",
      target: `http://vtistaging.aitcloud.de`,
    }),
  );

  // BetRadar Custom Bet proxy
  app.use(
    "/custombet",
    createProxyMiddleware({
      changeOrigin: true,
      logLevel: "debug",
      // prependPath: false,
      target: `http://180.232.20.232:7020`,
    }),
  );
};
