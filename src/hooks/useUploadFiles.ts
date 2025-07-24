import { useState } from "react";
import { http } from "../lib/http";

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

  const uploadFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return [];

    setUploading(true);
    setError(null);

    const formData = new FormData();
    // Handle both FileList and File[] by converting to array
    const fileArray = Array.isArray(files) ? files : Array.from(files);
    fileArray.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api"
        }/files/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = (await response.json()) as UploadFilesResponse;
      setUploading(false);
      return result.files.map((file) => file.filename);
    } catch (err) {
      setError(err as Error);
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
