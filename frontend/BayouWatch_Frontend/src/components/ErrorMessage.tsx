import { useState } from "react";
import { X } from "lucide-react";


interface ErrorMessageProps {
    message: string;
    type?: "error" | "warning" | "info";
}


const typeStyles = {
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
};


export default function ErrorMessage({ message, type = "error" }: ErrorMessageProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;


return (
    <div
      className={`border p-4 rounded-xl flex items-start justify-between shadow-md ${typeStyles[type]}`}
    >
      <p className="text-base font-medium">{message}</p>
      <button onClick={() => setVisible(false)} className="ml-4">
        <X className="w-5 h-5" />
      </button>
    </div>
 );
}