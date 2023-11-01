import axios from "axios";

const customAxios = axios.create();

customAxios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("AccessToken");

    if (accessToken) {
      try {
        const user = await axios.post(
            'https://ghz200n9c8.execute-api.us-east-1.amazonaws.com/auth/verify-token',
          {
            token: accessToken,
          }
        );

        if (user.data.error) {
          localStorage.clear();
          window.location.href = "/login";
        } else {
          config.headers.Authorization = `${accessToken}`;
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.clear();
        window.location.href = "/login";
      }
    } else {
      localStorage.clear();
      window.location.href = "/login";
    }
    return config;
  },
  (error) => {
    console.error("Request Error Interceptor:", error);
    return Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  (response) => {
    if (response.data?.loginNeeded) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return response;
  },
  (error) => {
    console.error("Response Error Interceptor:", error);
    return Promise.reject(error);
  }
);

export default customAxios;
