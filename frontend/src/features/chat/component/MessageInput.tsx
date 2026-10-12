import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader2, Send, Upload } from 'lucide-react';
import { useChatStore, type Attachment } from '../store/useChatStore';
import { PAYLOAD_MODEL, UPLOAD_TYPE } from '@/constants/constants';
import { FILE_RULES } from '@/utils/fileValidation';
import { uploadService } from '@/service/upload.service';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import toast from 'react-hot-toast';

interface MessageInputProps {
  conversationId: string | null;
  recipientId?: string;
  contextSessionId?: string;
  contextSessionModel?: (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL];
  onConversationCreated?: (conversationId: string) => void;
}

export const MessageInput = ({ conversationId, recipientId, contextSessionId, contextSessionModel, onConversationCreated }: MessageInputProps) => {
  const [text, setText] = useState('');


  const lastCreatedConversationId = useChatStore((s) => s.lastCreatedConversationId);
  const { user } = useAuthStore();
  const sendMessage = useChatStore((s) => s.sendMessage);
  const [isSending, setIsSending] = useState(false);
  useEffect(() => {
    if (lastCreatedConversationId && onConversationCreated) {
      onConversationCreated(lastCreatedConversationId);
    }
  }, [lastCreatedConversationId, onConversationCreated]);

  const handleUpload = async (file: File) => {
    if (!file) {
      toast.error('file not selected');
      return;
    }
    if (!user) {
      toast.error('please login');
      return;
    }
    const userId = user.id;
    const folderPath = `chat/${userId}`;
    try {
      const [urls] = await uploadService.upload(file, `${folderPath}/${file.name}`, userId, UPLOAD_TYPE.CHAT_FILE);
      console.log(urls);
      const fileAttachment: Attachment = {
        url: urls,
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
      };    

      handleSend({ type: 'file', attachment: fileAttachment });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'file upload failed ,try again');
    }
  };
  const handleSendText = () => {
    if (!text.trim()) return;
    handleSend({ type: 'text', text: text.trim() });
    setText('');
  };
  const handleSend = ({ type, text, attachment }: { type: 'text' | 'file'; text?: string; attachment?: Attachment }) => {
   
    setIsSending(true);
    const newMessage = {
      conversationId: conversationId ?? undefined, // present if conversation already exists
      recipientId: conversationId ? undefined : recipientId, // only needed for first message
      contextSessionId: conversationId ? undefined : contextSessionId,
      contextSessionModel: conversationId ? undefined : (contextSessionModel as (typeof PAYLOAD_MODEL)[keyof typeof PAYLOAD_MODEL] | undefined),
      type,
      text: type === 'text' ? text : undefined,
      attachment: type === 'file' ? attachment : undefined,
    };
    sendMessage(newMessage);
    setIsSending(false);
    setText('');
  };

  return (
    <div className="flex items-center gap-2 p-3 mb-4 border-t">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendText();
          }
        }}
        placeholder="Type a message..."
        className="flex-1"
      />
      <label className="flex flex-col items-center justify-center   border-2 border-dashed rounded-lg cursor-pointer hover:text-green-600">
        {/* <div className="flex flex-col items-center justify-center pt-5 pb-3"> */}
        <Upload className="w-3 h-3 " />
        <input
          type="file"
          className="hidden"
          accept={FILE_RULES.chat.accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const maxSize = FILE_RULES.chat.maxSizeMB * 1024 * 1024;
            if (file.size >= maxSize) {
              e.target.setCustomValidity(`File must be under ${FILE_RULES.chat.maxSizeMB} MB`);
              e.target.reportValidity();
              e.target.value = '';
              return;
            }
            e.target.setCustomValidity('');
            handleUpload(file);
          }}
        />
      </label>
      <Button size="icon" onClick={handleSendText} disabled={!text.trim()}>
        {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </div>
  );
};
