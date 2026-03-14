interface Props {
  type: "success" | "error";
  message: string;
}

export default function AlertBox({ type, message }: Props) {
  return (
    <div
      className={`rounded-xl px-4 py-3 text-sm font-medium ${
        type === "success"
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-red-100 text-red-700 border border-red-200"
      }`}
    >
      {message}
    </div>
  );
}