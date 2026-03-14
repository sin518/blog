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
    onChange(url!);
  };

  if (!showDropzone && value) {
    return (
      <div className="relative">
        <div className="relative w-full min-w-[600px] min-h-[200px] shadow-lg overflow-hidden rounded-xl">
          <img
            src={value}
            className="object-cover w-full h-full"
            alt="thumbnail"
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="absolute rounded-full right-0 top-0 bg-white opacity-60 hover:opacity-100 shadow-2xl p-2 m-2 cursor-pointer"
          >
            <X />
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
