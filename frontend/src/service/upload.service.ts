import api from "@/api/axiosInstance";


const UPLOAD_ROUTES={
    UPLOAD:'/upload/uploadfile'
}
export const uploadService={
        upload:async (file: File, folder:string): Promise<string> => {
           
            const formData = new FormData();
            formData.append("folder", folder); 
            formData.append("file", file);
           

            const res = await api.post(UPLOAD_ROUTES.UPLOAD, formData,{
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res.data.url; 
        }
}


