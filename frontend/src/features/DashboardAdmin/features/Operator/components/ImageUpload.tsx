/* eslint-disable jsx-a11y/no-static-element-interactions */
// components/form/ImageUpload.tsx
import React, { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
  currentImage?: string; // URL of the current image to show as preview
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Upload Foto",
  error,
  required = false,
  disabled = false,
  maxSize = 5, // 5MB default
  acceptedFormats = ["image/png", "image/jpg", "image/jpeg", "image/gif"],
  className = "",
  currentImage,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate preview when value or currentImage changes
  React.useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);

      setPreview(url);

      return () => URL.revokeObjectURL(url);
    } else if (currentImage) {
      setPreview(currentImage);
    } else {
      setPreview(null);
    }
  }, [value, currentImage]);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      toast.error(
        "Format file tidak didukung. Gunakan PNG, JPG, JPEG, atau GIF",
      );

      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > maxSize) {
      toast.error(`Ukuran file terlalu besar. Maksimal ${maxSize}MB`);

      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onChange(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        ref={fileInputRef}
        accept={acceptedFormats.join(",")}
        className="hidden"
        disabled={disabled}
        type="file"
        onChange={handleInputChange}
      />

      <div
        className={`border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragOver
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : preview
              ? "border-green-300 bg-green-50 dark:bg-green-900/20"
              : error
                ? "border-red-300 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleClick}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="p-6">
          {preview ? (
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  alt="Preview"
                  className="max-w-full max-h-40 rounded-lg shadow-md"
                  src={preview}
                />
                {!disabled && (
                  <Button
                    isIconOnly
                    className="absolute -top-2 -right-2 min-w-6 w-6 h-6"
                    color="danger"
                    size="sm"
                    variant="solid"
                    onPress={() => {
                      handleRemove();
                    }}
                  >
                    ✕
                  </Button>
                )}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                {value?.name ||
                  (currentImage ? "Foto saat ini" : "Foto diunggah")}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {value && `${(value.size / (1024 * 1024)).toFixed(2)} MB`}
              </p>
              {!disabled && (
                <p className="text-xs text-gray-400 mt-2">
                  Klik untuk mengganti foto
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl text-gray-400 mb-2">📷</div>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                {isDragOver
                  ? "Drop foto di sini"
                  : "Klik atau drag foto ke sini"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, JPEG, GIF (max {maxSize}MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
