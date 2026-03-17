"use client";

import Modal from "@/components/common/Modal";

interface ImagePreviewModalProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function ImagePreviewModal({
  open,
  imageUrl,
  onClose,
}: ImagePreviewModalProps) {
  return (
    <Modal open={open}  onClose={onClose} title="Rasm preview">
      <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-black ${console.log(imageUrl)}`}>
        <img
          src={imageUrl}
          alt="Preview"
          className="max-h-[75vh] w-full object-contain"
        />
        
      </div>
    </Modal>
  );
}
