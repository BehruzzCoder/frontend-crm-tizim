import { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function TextInput({
  label,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      ) : null}

      <input
        {...props}
        className={`w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 ${className}`}
      />
    </div>
  );
}