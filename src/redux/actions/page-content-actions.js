import { createAsyncThunk } from "@reduxjs/toolkit";

import createAxiosInstance from "../async/axios";
import { getRequestParams } from "../async/get-fetch-params";

export const getPageContent = createAsyncThunk(
  "pagecontent/getPageContent",
  async ({ cancelToken, pageContentId }, thunkAPI) => {
    try {
      const { authToken, language, lineId, originId } = getRequestParams(thunkAPI.getState());
      const axios = createAxiosInstance(thunkAPI.dispatch, {
        authToken,
        language,
      });

      const result = await axios.get(
        `/player/cms/contentpages/${pageContentId}?lineId=${lineId}&originId=${originId}`,
        {
          cancelToken,
        },
      );

      return {
        contentData: result.data?.data,
      };
    } catch (err) {
      const customError = {
        message: err.response.headers["x-information"] || "Unable to obtain country details", // serializable (err.response.data)
        name: "Country list Fetch Error",
        status: err.response.statusText,
      };
      throw customError;
    }
  },
);
