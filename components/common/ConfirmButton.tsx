"use client";

interface Props {
  onConfirm: () => void;
  children: React.ReactNode;
  className?: string;
  confirmText?: string;
}

export default function ConfirmButton({
  onConfirm,
  children,
  className = "",
  confirmText = "Rostdan ham o‘chirmoqchimisiz?",
}: Props) {
  const handleClick = () => {
    const ok = window.confirm(confirmText);
    if (ok) {
      onConfirm();
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}