import api from '@/api/axiosInstance';

const UPLOAD_ROUTES = {
  UPLOAD: '/upload/uploadfile',
};
export const uploadService = {
  upload: async (
    files: File | FileList,
    folder: string,
    userId: string,
    uploadType: string
  ): Promise<string[]> => {
    const formData = new FormData();
    formData.append('folder', folder);
    formData.append('userId', userId);
    formData.append('uploadType', uploadType);
    if (files instanceof FileList) {
      Array.from(files).forEach((file) => {
        formData.append('files', file); // Use "files" (plural) to match backend expectations
      });
    } else {
      formData.append('files', files);
    }
    // formData.append("file", file);

    const res = await api.post(UPLOAD_ROUTES.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.urls;
  },
};
