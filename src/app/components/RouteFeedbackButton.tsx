// RouteFeedbackButton.tsx
import React from "react";

type RouteFeedbackButtonProps = {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
};

export const RouteFeedbackButton: React.FC<RouteFeedbackButtonProps> = ({
  onClick,
  active,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`z-10 fixed top-4 left-4 p-2 bg-blue-500 ${
        active ? "bg-blue-700" : ""
      } ${
        !active ? "hover:bg-blue-600" : ""
      } text-white rounded-md transition-colors`}
    >
      {children}
    </button>
  );
};
