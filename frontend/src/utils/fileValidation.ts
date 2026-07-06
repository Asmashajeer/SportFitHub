

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