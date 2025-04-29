
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Download, File, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FileInfo {
  path: string;
  url: string;
  name: string;
  size?: number;
  type?: string;
}

interface FileListProps {
  files: FileInfo[];
  bucketName: string;
  onFileDelete?: (path: string) => void;
  readonly?: boolean;
}

export function FileList({
  files,
  bucketName,
  onFileDelete,
  readonly = false,
}: FileListProps) {
  const handleDelete = async (path: string) => {
    try {
      const { error } = await supabase.storage.from(bucketName).remove([path]);
      if (error) throw error;
      
      if (onFileDelete) {
        onFileDelete(path);
      }
      
      toast.success("Файл успешно удален");
    } catch (error: any) {
      toast.error(`Ошибка удаления: ${error.message}`);
    }
  };

  if (!files.length) {
    return <p className="text-sm text-muted-foreground">Нет прикрепленных файлов</p>;
  }

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-muted-foreground" />
            <div className="truncate max-w-[200px]">
              <p className="text-sm font-medium truncate">{file.name}</p>
              {file.size && (
                <p className="text-xs text-muted-foreground">
                  {Math.round(file.size / 1024)} KB
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8"
            >
              <a href={file.url} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
            
            {!readonly && onFileDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDelete(file.path)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
