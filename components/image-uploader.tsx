"use client";
import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { X } from "lucide-react";
import { toast } from "sonner";

type ImageUploaderProps = {
  defaultUrl?: string;
  onChange: (url: string) => void;
  endpoint: keyof OurFileRouter;
};

export default function ImageUploader({
  defaultUrl,
  onChange,
  endpoint,
}: ImageUploaderProps) {
  const [value, setValue] = useState<string | null>(defaultUrl ?? null);
  const [showDropzone, setShowDropzone] = useState<boolean>(!defaultUrl);

  const handleSet = (url: string | null) => {
    setValue(url);
    onChange(url ?? "");
  };

  if (!showDropzone && value) {
    return (
      <div className="relative">
        <div className="relative w-full min-h-50 shadow-lg overflow-hidden rounded-xl">
          <img
            src={value}
            className="object-cover w-full h-full"
            alt="thumbnail"
          />
          <button
            type="button"
            onClick={() => {
              handleSet(null);
              setShowDropzone(true);
            }}
            className="absolute right-2 top-2 rounded-full bg-white opacity-80 hover:opacity-100 shadow p-1 cursor-pointer"
            aria-label="移除图片"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <UploadDropzone
        endpoint={endpoint}
        content={{
          label: value ? "点击或拖动图片更换" : "点击或拖动图片上传",
          allowedContent: "PNG, JPG, JPEG .up to 4MB",
        }}
        appearance={{
          button: "rounded-lg",
          container: "rounded-xl border",
        }}
        onUploadBegin={() => {
          console.log("开始上传");
        }}
        onUploadError={(e) => {
          toast.error(`上传出错: ${e.message}`);
        }}
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.url;

          if (url) {
            handleSet(url);
            setShowDropzone(false);
          } else {
            toast.error("上传失败，请重试");
          }
        }}
      />
    </div>
  );
}
