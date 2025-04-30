
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";

interface FileUploadResponse {
  path: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

export function useFileUpload(bucketName: string) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<number>(0);

  const uploadFile = useMutation({
    mutationFn: async (file: File): Promise<FileUploadResponse> => {
      if (!user) throw new Error("Пользователь не авторизован");
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Since onUploadProgress is not available in FileOptions, we can't track progress directly
      // We'll set it to indeterminate progress during upload
      setProgress(0);
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      if (!data) throw new Error("Ошибка при загрузке файла");
      
      // Once upload is complete, set progress to 100%
      setProgress(100);
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      return {
        path: data.path,
        url: publicUrlData.publicUrl,
        name: file.name,
        size: file.size,
        type: file.type
      };
    },
  });

  return {
    uploadFile,
    progress,
  };
}
