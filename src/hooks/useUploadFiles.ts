import { useState } from "react";
import { http } from "../lib/http";
import { useAuth } from "../context/AuthContext";

interface UploadFileResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  path: string;
}

interface UploadFilesResponse {
  success: boolean;
  message: string;
  files: UploadFileResponse[];
}

export function useUploadFiles() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useAuth();
  
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const uploadFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return [];

    setUploading(true);
    setError(null);

    try {
      // Validate file count
      if (files.length > MAX_FILES) {
        throw new Error(`Maksimal ${MAX_FILES} gambar diperbolehkan`);
      }

      // Validate file types and sizes
      const fileArray = Array.isArray(files) ? files : Array.from(files);
      
      // Check for invalid files
      const invalidFiles = fileArray.filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= MAX_FILE_SIZE;
        return !isValidType || !isValidSize;
      });
      
      if (invalidFiles.length > 0) {
        throw new Error('Semua file harus berupa gambar (JPG, PNG) dengan ukuran maksimal 5MB');
      }
      
      // Create FormData with valid files
      const formData = new FormData();
      fileArray.forEach((file, index) => {
        // Use index as part of the field name to ensure server handles them correctly
        formData.append(`files`, file);
      });

      console.log(`Uploading ${fileArray.length} files...`);

      // Use the http utility which automatically includes the token
      const result = await http<UploadFilesResponse>("/files/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      console.log(`Successfully uploaded ${result.files.length} files`);
      setUploading(false);
      return result.files.map((file) => file.filename);
    } catch (err: any) {
      console.error("File upload error:", err);
      setError(err);
      setUploading(false);
      return [];
    }
  };

  return {
    uploading,
    error,
    uploadFiles,
  };
}
