// FeaturePopup.tsx
import React from "react";
import { Popup } from "react-map-gl";

interface FeaturePopupProps {
  latitude: number;
  longitude: number;
  onClose: () => void;
  clickedGeoJSONFeature: any; // Update this type according to your data
}

interface PopupText {
  header: string;
  text: string;
}

export const FeaturePopup: React.FC<FeaturePopupProps> = ({
  latitude,
  longitude,
  onClose,
  clickedGeoJSONFeature,
}) => {
  const props = clickedGeoJSONFeature.properties;
  const keys = Object.keys(props);
  let popupText: PopupText = {
    header: "",
    text: "",
  };
  if (keys.includes("MLG_Label")) {
    popupText = {
      header: "Mainline Greenway",
      text: props.MLG_Label,
    };
  } else if (keys.includes("linklts")) {
    popupText = {
      header: "Level of Traffic Stress",
      text: props.linklts,
    };
  } else if (keys.includes("comment")) {
    popupText = {
      header: "Comment",
      text: props.comment,
    };
  }

  return (
    popupText && (
      <Popup
        latitude={latitude}
        longitude={longitude}
        closeButton={true}
        closeOnClick={false}
        onClose={onClose}
        anchor="top"
      >
        <h3 className="text-black font-bold">{popupText.header}</h3>
        <p className="text-black">{popupText.text}</p>
      </Popup>
    )
  );
};
