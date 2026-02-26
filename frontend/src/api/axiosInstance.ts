import axios from "axios";
import { useAuthStore } from "../features/auth/store/useAuthStore";
const API_URL=import.meta.env.VITE_BACKEND_URL;


const api = axios.create({
  baseURL:API_URL ||" http://localhost:5000/api/v1" ,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json'
  }
});


// to refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginPath = originalRequest.url.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginPath &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
       
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);



// error handling
api.interceptors.response.use( 
  (response)=>response,
  async(error)=>{
    let errorMessage = "An unexpected error occurred";
    if (axios.isAxiosError(error)) {
        if (axios.isCancel(error)) {
         console.log("Request canceled:", error.message);
           return new Promise(() => {});
        }
        if(error.response){
          errorMessage = error.response?.data?.message || "Server upload failed";
     
          console.error("Axios Error:", error,error.response?.status); 
        }else if(error.request){
          errorMessage ="Network error: Please check your internet connection.";
          console.log(errorMessage);
        }      
    } else if (error instanceof Error) {  
        errorMessage=error.message;      
        console.log("Error:",errorMessage);       
    } 
    console.log("Error:",error);
    return Promise.reject( errorMessage);

  }
)
export default api;
