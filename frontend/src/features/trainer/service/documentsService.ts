import api from "@/api/axiosInstance"
import { DOCUMENTS_ROUTE } from "./trainer.api";

export const documentsService = {
    getCertificateDoc:async(certId:string,trainerId:string)=>{
        const res=await api.get(DOCUMENTS_ROUTE.GET_CERTIFICATE,{ params: { certId,trainerId },responseType: 'blob',  });
        return res.data;
    },
    getIdAttchmentDoc:async(trainerId:string)=>{
        const res=await api.get(DOCUMENTS_ROUTE.GET_ID_ATTACHMENT,{ params: { trainerId },responseType: 'blob',  });
        return res.data;
    }
}