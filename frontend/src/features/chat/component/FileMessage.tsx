import { Download, File } from 'lucide-react';
import type { Attachment } from '../store/useChatStore';
import { formatFileSize } from '@/utils/FormatFileSize';
import { chatService } from '../service/chatService';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import toast from 'react-hot-toast';

const FileMessage = ({ attachment, conversationId }: { attachment: Attachment; conversationId: string }) => {
  const { url, originalName, size, mimeType } = attachment;
  const isImage = mimeType.startsWith('image/');
  const { user } = useAuthStore();

  const getAttachment = async () => {
    const newTab = window.open('', '_blank');
    try {
      if (user && conversationId) {
        const blob = await chatService.getAttachment(attachment, conversationId);
        const objectUrl = URL.createObjectURL(blob);
        if (newTab) {
          newTab.location.href = objectUrl;
        } else {
          toast.error('Please allow popups to view this document');
        }
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      }
    } catch (error) {
      newTab?.close();
      const message = error instanceof Error ? error.message : 'cannot open file,try again';
      toast.error(message);
      console.log(error);
    }
  };

  if (isImage && url) {
    return (
      <div className="border bg-emerald-700">
        <a onClick={() => getAttachment()} target="_blank">
          <img src={url} alt={originalName} className="max-w-60  rounded-md underline" />
        </a>
      </div>
    );
  }

  return (
    <div className="border bg-emerald-700">
      <a href="" onClick={() => getAttachment()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
        <File className="h-5 w-5 shrink-0 text-amber-800" />
        <div className="min-w-0">
          <p className="truncate text-sm">{originalName}</p>
          <p className="text-[10px] text-muted-foreground">{formatFileSize(size)}</p>
        </div>
        <Download className="h-4 w-4 shrink-0" />
      </a>
    </div>
  );
};
export default FileMessage;
