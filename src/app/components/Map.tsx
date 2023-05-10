"use client";

import React, { useState } from "react";
import ReactMapGL, {
  NavigationControl,
  Popup,
  Source,
  Layer,
} from "react-map-gl";
import { Map as MapboxGlMap } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import axios from "axios";
import { Feature, AllGeoJSON } from "@turf/helpers";
import { MLGMapping } from "../utils/mappings";
import { Legend } from "./Legend";

const submitDrawing = async (
  drawing: Feature,
  comment: string,
  contactInfo: string | null
) => {
  try {
    const response = await axios.post("/api/submitDrawing", {
      drawing,
      comment,
      contactInfo,
    });

    if (response.status !== 200) {
      throw new Error("Error submitting the drawing");
    }

    alert("Drawing submitted successfully");
  } catch (error: any) {
    alert(`Error: ${error.message}`);
  }
};

export const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.0223395,
    longitude: -75.2889206,
    zoom: 12,
  });

  const [map, setMap] = useState<MapboxGlMap | null>(null);
  const [draw, setDraw] = useState<MapboxDraw | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupInfo, setPopupInfo] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<AllGeoJSON> | null>(null);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [isLayerReady, setIsLayerReady] = useState(false);

  const onMapLoad = (mapInstance: MapboxGlMap) => {
    setMap(mapInstance);

    const drawInstance = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
      },
    });

    mapInstance.addControl(drawInstance, "top-left");
    setDraw(drawInstance);

    mapInstance.on("layer", (e: any) => {
      if (e.layer.id === "mainlinegreenway-layer") {
        setIsLayerReady(true);
      }
    });

    // Add a listener for the drawing events
    mapInstance.on("draw.create", async (e: any) => {
      const drawing = e.features[0] as Feature;

      // Show a popup to get the comment and contact information
      const comment = prompt("Please enter a comment for this drawing:");
      const contactInfo = prompt(
        "Please enter your contact information (optional):"
      );

      // Submit the drawing and comment to the backend
      if (comment) {
        await submitDrawing(drawing, comment, contactInfo);
      }

      // Remove the drawing from the map
      if (typeof drawing.id === "string") {
        drawInstance.delete(drawing.id);
      }
    });

    // Add event listeners for mousemove and mouseleave
    mapInstance.on("mousemove", "mainlinegreenway-layer", () => {
      mapInstance.getCanvas().style.cursor = "pointer";
    });
    mapInstance.on("mouseleave", "mainlinegreenway-layer", () => {
      mapInstance.getCanvas().style.cursor = "default";
    });
  };

  const onFeatureClick = (e: any) => {
    if (map) {
      const point = e.point;
      const features = map.queryRenderedFeatures(point, {
        layers: ["mainlinegreenway-layer"],
      });

      if (features.length > 0) {
        setSelectedFeature(features[0] as unknown as Feature<AllGeoJSON>);
        setPopupInfo(e.lngLat);
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
    }
  };

  const onMapClick = () => {
    setShowPopup(false);
  };

  return (
    <ReactMapGL
      initialViewState={viewport}
      style={{
        width: "100vw",
        height: "100vh",
        cursor: cursorStyle,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      onMoveEnd={(e: any) => {
        setViewport({
          longitude: e.target.getCenter().lng,
          latitude: e.target.getCenter().lat,
          zoom: e.target.getZoom(),
        });
      }}
      onLoad={(e) => onMapLoad(e.target)}
      //interactiveLayerIds={["geojson-layer"]}
      onMouseMove={(e) => {
        if (map && isLayerReady) {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["mainlinegreenway-layer"],
          });
          const overFeature = features.length > 0;
          setCursorStyle(overFeature ? "pointer" : "default");
        }
      }}
      onClick={onFeatureClick}
    >
      <Source
        id="geojson"
        type="geojson"
        data={"/data/mainlinegreenway.geojson"}
      >
        <Layer
          id="mainlinegreenway-layer"
          type="line"
          paint={{
            "line-color": [
              "match",
              ["get", "MLG_Label"],
              ...Object.entries(MLGMapping).flatMap(([key, { style }]) => [
                key,
                style.backgroundColor,
              ]),
              "#000", // Default color
            ],
            "line-width": 3,
          }}
        />
      </Source>

      {showPopup && selectedFeature && popupInfo && (
        <Popup
          latitude={popupInfo.lat}
          longitude={popupInfo.lng}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setShowPopup(false)}
          anchor="top"
        >
          <div className="popup-text">
            <h3>Feature Details</h3>
            <p>
              {/* Display feature properties here */}
              {/* Example: */}
              Property 1: {selectedFeature.properties?.MLG_Label}
            </p>
          </div>
        </Popup>
      )}
      <NavigationControl showCompass={false} />
      <Legend />
    </ReactMapGL>
  );
};
