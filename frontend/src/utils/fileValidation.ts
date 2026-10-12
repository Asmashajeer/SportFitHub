

export const FILE_RULES = {
  profile_pic: {
    accept: 'image/*',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    label: 'Images only (JPEG, PNG, WEBP)',
  },
  id_attachment: {
    accept: 'image/*,application/pdf',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    label: 'Images or PDF only',
  },
  certification: {
    accept: 'application/pdf',
    mimeTypes: ['application/pdf'],
    label: 'PDF only',
  },
  chat: {
    accept:
      'image/jpeg,image/png,image/webp,image/gif,' +
      'application/pdf,' +
      'application/msword,' +
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document,' +
      'application/vnd.ms-excel,' +
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' +
      'text/plain,text/csv,' +
      '.jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv',

    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
    ],

    label: 'Images, PDF, Word, Excel, TXT or CSV (max 10 MB)',
    maxSizeMB: 10,
  },
} as const;

export type UploadType = keyof typeof FILE_RULES;

export const validateFileType = (file: File, uploadType: UploadType): string | null => {
  const rule = FILE_RULES[uploadType];
  const mimeTypes = rule.mimeTypes as readonly string[];
  if (!mimeTypes.includes(file.type)) {
    return `Invalid file type. ${rule.label}.`;
  }
  return null; // valid
};