import React from "react";

export interface CustomDataEntryPopupProps {
  latitude: number;
  longitude: number;
  onClose: () => void;
  onSubmit: (comment: string, contactInfo: string | null) => void;
  onCloseButtonClick: () => void;
  onCancel?: () => void; // Add this line
}

export const CustomDataEntryPopup: React.FC<CustomDataEntryPopupProps> = ({
  latitude,
  longitude,
  onClose,
  onSubmit,
  onCloseButtonClick,
  onCancel,
}) => {
  const [comment, setComment] = React.useState("");
  const [contactInfo, setContactInfo] = React.useState("");

  const handleSubmit = () => {
    onSubmit(comment, contactInfo);
    setComment("");
    setContactInfo("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-10 bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <div
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div
          className="relative bg-white p-6 rounded-lg w-11/12 md:w-1/2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-gray-800 text-2xl font-bold mb-4">
            Submit Feedback
          </h2>
          <label className="block text-gray-800">Comment:</label>
          <input
            className="block w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-800" // Add text-gray-800
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <label className="block text-gray-800">
            Contact Info (optional):
          </label>
          <input
            className="block w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-800" // Add text-gray-800
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
          <button
            className={`px-4 py-2 rounded-md text-white ${
              comment ? "bg-green-500" : "bg-gray-500 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!comment}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
