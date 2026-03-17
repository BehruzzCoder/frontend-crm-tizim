"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "@/components/common/Modal";
import PrimaryButton from "@/components/common/PrimaryButton";

interface CameraCaptureModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onCapture: (file: File) => Promise<void> | void;
}

export default function CameraCaptureModal({
  open,
  title,
  onClose,
  onCapture,
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      setErrorText("");
      setCapturedBlob(null);
      setPreviewUrl("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setErrorText("Kamera ochilmadi. Brauzerga ruxsat bering.");
    }
  };

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [open]);

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setCapturedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.95
    );
  };

  const handleRetake = async () => {
    setCapturedBlob(null);
    setPreviewUrl("");
    await startCamera();
  };

  const handleSubmit = async () => {
    if (!capturedBlob) {
      setErrorText("Avval rasmga oling");
      return;
    }

    try {
      setLoading(true);

      const file = new File([capturedBlob], `attendance-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      await onCapture(file);
      onClose();
    } catch {
      setErrorText("Rasm yuborishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        {!previewUrl ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-[420px] w-full object-cover"
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-[420px] w-full object-cover"
            />
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {errorText ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorText}
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3">
{!previewUrl ? (
            <PrimaryButton type="button" onClick={handleTakePhoto}>
              Rasmga olish
            </PrimaryButton>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700"
              >
                Qayta olish
              </button>

              <PrimaryButton
                type="button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Yuborilmoqda..." : "Tasdiqlash"}
              </PrimaryButton>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}