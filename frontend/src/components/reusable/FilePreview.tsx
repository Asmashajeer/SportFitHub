import { useEffect, useState } from 'react';

type Props = { file?:  File  | null; name?: string };

export function FilePreview({ file:fileInput, name }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const file = fileInput;
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl); // free memory
  }, [file]);

  if (!file || !url) return null;

  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  return (
    <div className="flex items-center gap-3 rounded-lg border p-2">
      {isImage ? (
        <img src={url} alt={name ?? file.name} className="h-24 w-24 rounded object-cover" />
      ) : isPdf ? (
        <iframe
          src={`${url}#toolbar=0&navpanes=0`}
          title={name ?? file.name}
          className="h-24 w-20 rounded border"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded bg-muted text-xs">
          FILE
        </div>
      )}

      <div className="min-w-0  text-xs">
        <p className="truncate font-medium">{name}</p>
        {/* <p className="text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p> */}
        <a href={url} target="_blank" rel="noreferrer" className="text-primary underline">
          Open
        </a>
      </div>
    </div>
  );
}