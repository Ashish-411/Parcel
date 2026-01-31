import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
import { useAuth } from "./contexts/AuthContext";
const api = axios.create({
    baseURL: "https://conservatively-oxidable-brice.ngrok-free.dev",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
);

export const setupInterceptors = (refreshAccessToken) =>{
        api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
            const newToken = await refreshAccessToken(); // from AuthContext
            if (newToken) {
                error.config.headers['Authorization'] = `Bearer ${newToken}`;
                return api.request(error.config); // retry original request
            }
            }
            return Promise.reject(error);
        }
        );
}

export default api;
