import axios  from 'axios'

const api=axios.create({    
    baseURL:'http://localhost:5000/api/v1',
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    },
});

api.interceptors.response.use(    
    (response)=>response,
    async (error)=>{
        const originalRequest=error.config;
        const isLoginPath = originalRequest.url.includes('/auth/login');

        if(error.response?.status===401 &&!originalRequest._retry &&!isLoginPath && !originalRequest.url.includes('/auth/refresh')){
            originalRequest._retry=true;
            try{
                const response=await api.post('/auth/refresh');
                const { accessToken } = response.data;
            
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return api(originalRequest);
            }
            catch(refreshError){               
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
    
)

export default api;