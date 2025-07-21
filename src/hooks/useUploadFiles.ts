import { useState } from "react";

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

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return [];

    setUploading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
        }/files/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(response.body);

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
