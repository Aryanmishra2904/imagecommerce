"use client";

import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function FileUpload({
  onSuccess,
  prefix = "product",
}: {
  onSuccess: (res: IKUploadResponse) => void;
  prefix?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("default.jpg");

  const onError = (err: { message: string }) => {
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleStartUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    setError(null);

   
    const file = evt.target.files?.[0];
    if (!file) return;

    
    const extension = file.name.split(".").pop();
    const uniqueId = Math.random().toString(36).slice(2, 8);
    const dynamicName = `${prefix}-${Date.now()}-${uniqueId}.${extension}`;

    setFileName(dynamicName);
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileName}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleStartUpload} 
        className="file-input file-input-bordered w-full"
        validateFile={(file: File) => {
          const validTypes = ["image/jpeg", "image/png", "image/webp"];
          if (!validTypes.includes(file.type)) {
            setError("Please upload a valid image file (JPEG, PNG, or WebP)");
            return false;
          }
          if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return false;
          }
          return true;
        }}
      />

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}
