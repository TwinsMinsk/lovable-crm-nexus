
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

interface FileUploaderProps {
  bucketName: string;
  onUploadComplete: (fileInfo: {
    path: string;
    url: string;
    name: string;
    size: number;
    type: string;
  }) => void;
}

export function FileUploader({ bucketName, onUploadComplete }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadFile, progress } = useFileUpload(bucketName);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadFile.mutateAsync(selectedFile);
      onUploadComplete(result);
      setSelectedFile(null);
      toast.success("Файл успешно загружен");
    } catch (error: any) {
      toast.error(`Ошибка загрузки: ${error.message}`);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          type="file"
          onChange={handleFileChange}
          className="max-w-xs"
          disabled={uploadFile.isPending}
        />
        {selectedFile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSelection}
            type="button"
            disabled={uploadFile.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {selectedFile && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</p>
          
          {uploadFile.isPending && (
            <Progress value={progress} className="h-2" />
          )}
          
          <Button 
            onClick={handleUpload} 
            disabled={uploadFile.isPending}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploadFile.isPending ? "Загрузка..." : "Загрузить"}
          </Button>
        </div>
      )}
    </div>
  );
}
