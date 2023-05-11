import React, { useState } from "react";
import { Popup } from "react-map-gl";

interface CustomDataEntryPopupProps {
  latitude: number;
  longitude: number;
  onClose: () => void;
  onSubmit: (comment: string, contactInfo: string | null) => void;
  onCloseButtonClick: () => void;
}

export const CustomDataEntryPopup: React.FC<CustomDataEntryPopupProps> = ({
  latitude,
  longitude,
  onClose,
  onSubmit,
  onCloseButtonClick,
}) => {
  const [comment, setComment] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = () => {
    onSubmit(comment, contactInfo);
  };

  return (
    <Popup
      latitude={latitude}
      longitude={longitude}
      closeButton={true}
      closeOnClick={false}
      onClose={onClose}
      anchor="top"
    >
      <div>
        <h3>Data Entry</h3>
        <form>
          <label>
            Comment:
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
          <br />
          <label>
            Contact Info (optional):
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
            />
          </label>
          <br />
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
          <button type="button" onClick={onCloseButtonClick}>
            Cancel
          </button>
        </form>
      </div>
    </Popup>
  );
};
