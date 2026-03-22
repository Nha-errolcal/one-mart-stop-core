import axios from "axios";
import { Config } from "../util/Config";
import {
  getAcccessToken,
  removeAcccessToken,
  setAcccessToken,
} from "./profile";
import { setServerStatus } from "./serverStore";
import dayjs from "dayjs";

const logError = (message, details) => {
  console.error(`[Error] ${message}`, details || "");
};

const handleError = async (err, url) => {
  const response = err.response;
  let status = "error";

  if (response) {
    status = response.status;

    if (status === 401) {
      console.warn("Unauthorized access. Attempting token refresh...");
      const refreshed = await refreshToken();
      if (refreshed) {
        return request(url, err.config.method, err.config.data);
      } else {
        logError("Token refresh failed. Logging out.");
        removeAcccessToken();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    } else if (status === 422) {
      logError("Validation Error:", response.data);
      setServerStatus(response.data);
    } else {
      logError("Request failed:", {
        status,
        message: response.data?.message || "Unknown error",
        url,
      });
    }
  } else if (err.code === "ERR_NETWORK") {
    logError("Network Error:", err.message);
  } else if (err.code === "ECONNABORTED") {
    logError("Request Timeout:", err.message);
  }

  setServerStatus(status);
  return false;
};

export const refreshToken = async () => {
  try {
    const res = await axios.post(
      `${Config.base_url}${Config.endpoints.refresh}`,
      {},
      {
        headers: { Authorization: `Bearer ${getAcccessToken()}` },
      }
    );
    const newToken = res.data.access_token;
    setAcccessToken(newToken);
    console.log("Token refreshed successfully.");
    return true;
  } catch (err) {
    logError("Failed to refresh token:", err.message);
    return false;
  }
};

export const request = (url = "", method = "get", data = {}) => {
  const access_token = getAcccessToken();
  const headers = {
    "Content-Type":
      data instanceof FormData ? "multipart/form-data" : "application/json",
    Authorization: `Bearer ${access_token}`,
  };
  let param_query = "?";
  if (method === "get" && data instanceof Object) {
    Object.keys(data).forEach((key) => {
      if (data[key] !== "" && data[key] !== null) {
        param_query += `&${key}=${data[key]}`;
      }
    });
  }

  return axios({
    url: `${Config.base_url}${url}${param_query}`,
    method,
    data,
    headers,
  })
    .then((res) => {
      setServerStatus(200);
      return res.data;
    })
    .catch((err) => handleError(err, url));
};

export const formatDate = (value) => dayjs(value).format("YYYY-MMM-DD");
