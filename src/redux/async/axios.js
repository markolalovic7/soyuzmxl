import axios from "axios";

import { logout, setAuthToken } from "../actions/auth-actions";

import { getLocale } from "utils/locale";

const createAxiosInstance = (dispatch, { authToken, language, tillAuth } = {}) => {
  const instance = axios.create();
  instance.defaults.headers["Content-Type"] = "application/json";

  // Add a request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Actions before request is sent
      if (authToken) {
        config.headers["X-Token"] = authToken;
      }
      if (language) {
        config.headers["Accept-Language"] = getLocale(language);
      }
      if (tillAuth) {
        config.headers["X-Till-Auth"] = tillAuth;
      }

      return config;
    },
    (error) =>
      // Do something with request error
      Promise.reject(error),
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data

      // if there is a token in the response - update our local storage token
      const newToken = response.headers["X-Token"] || response.headers["x-token"];
      if (newToken && authToken !== newToken) {
        dispatch(setAuthToken({ authToken: newToken }));
      }

      return response;
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error

      // If forbidden error received - assume inappropriate access or user kicked out after a token expired.
      // Clear the logged in state so the user can be safely sent to the login page
      if ([401, 403].includes(error?.response?.status)) {
        dispatch(logout());
        window.parent.postMessage(
          {
            action: "app.auth.session",
            code: "SESSION_EXPIRED",
          },
          "*",
        );
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export default createAxiosInstance;
