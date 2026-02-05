import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Request interceptor to add the access token to every request
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (user?.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        // skip this for login and refresh routes to avoid loops/incorrect redirects
        const isLoginOrRefresh = originalRequest.url.includes("/users/login") || originalRequest.url.includes("/users/refresh");

        if (error.response?.status === 401 && !originalRequest._retry && !isLoginOrRefresh) {
            originalRequest._retry = true;

            try {
                const user = JSON.parse(localStorage.getItem("loggedInUser"));
                if (!user?.refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Call the refresh endpoint
                const res = await axios.post("http://localhost:5000/api/users/refresh", {
                    refreshToken: user.refreshToken,
                });

                const { accessToken } = res.data;

                // Update localStorage
                const updatedUser = { ...user, accessToken };
                localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

                // Update the original request header and retry
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Session expired. Please login again.", refreshError);
                localStorage.removeItem("loggedInUser");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
