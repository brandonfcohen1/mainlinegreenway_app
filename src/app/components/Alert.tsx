// src/app/components/Alert.tsx
import React, { useEffect } from "react";

interface AlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${bgColor} text-white z-50`}
    >
      <div className="flex justify-between items-center">
        <div>{message}</div>
        <button onClick={onClose} className="text-xl font-bold ml-4">
          &times;
        </button>
      </div>
    </div>
  );
};
