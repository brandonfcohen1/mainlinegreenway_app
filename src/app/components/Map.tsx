"use client";

import React, { useState } from "react";
import ReactMapGL, {
  NavigationControl,
  Source,
  Layer,
  Marker,
} from "react-map-gl";
import { Map as MapboxGlMap } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import axios from "axios";
import { Feature, AllGeoJSON, Geometry, Point } from "@turf/helpers";
import { LTSMapping, MLGMapping } from "../utils/mappings";
import { Legend } from "./Legend";
import { CustomDataEntryPopup } from "./CustomDataEntryPopup";
import { FeaturePopup } from "./FeaturePopup";
import { Alert } from "./Alert";
import { RouteFeedbackButton } from "./RouteFeedbackButton";
import { LayerControl } from "./LayerControl";
import { FiMapPin } from "react-icons/fi";

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
  const [clickedGeoJSONFeature, setClickedGeoJSONFeature] =
    useState<Feature<AllGeoJSON> | null>(null);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [isLayerReady, setIsLayerReady] = useState(false);
  const [showDataEntryPopup, setShowDataEntryPopup] = useState(false);
  const [drawnFeature, setDrawnFeature] = useState<Point | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });
  const [editingMode, setEditingMode] = useState(false);
  const [feedbackPinLatLng, setFeedbackPinLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [feedbacks, setFeedbacks] = useState<
    Array<{ lat: number; lng: number; comment: string }>
  >([]);
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/streets-v11"
  );
  const [trafficStressLayerVisible, setTrafficStressLayerVisible] =
    useState(false);

  const onMapLoad = (mapInstance: MapboxGlMap) => {
    setMap(mapInstance);

    const drawInstance = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: false,
      },
    });

    mapInstance.addControl(drawInstance, "top-left");
    setDraw(drawInstance);

    mapInstance.on("layer", (e: any) => {
      if (e.layer.id === "mainlinegreenway-layer") {
        setIsLayerReady(true);
      }
    });

    mapInstance.on("draw.create", async (e: any) => {
      const drawing = e.features[0] as Feature;
      const pointGeometry = drawing.geometry as Point;

      setDrawnFeature(pointGeometry);
      setFeedbackPinLatLng({
        lat: pointGeometry.coordinates[1],
        lng: pointGeometry.coordinates[0],
      });

      setShowDataEntryPopup(true);
      setShowPopup(false);
      setShowAlert(false);
      setEditingMode(false);

      if (typeof drawing.id === "string") {
        drawInstance.delete(drawing.id);
      }
    });

    mapInstance.on("draw.modechange", (e: any) => {
      if (e.mode === "draw_point") {
        mapInstance.getCanvas().style.cursor = "crosshair";
      } else {
        mapInstance.getCanvas().style.cursor = "default";
      }
    });

    mapInstance.on(
      "mousemove",
      ["mainlinegreenway-layer", "traffic-stress-layer"],
      () => {
        if (editingMode) {
          mapInstance.getCanvas().style.cursor = "crosshair";
        } else {
          mapInstance.getCanvas().style.cursor = "pointer";
        }
      }
    );

    mapInstance.on(
      "mouseleave",
      ["mainlinegreenway-layer", "traffic-stress-layer"],
      () => {
        mapInstance.getCanvas().style.cursor = "default";
      }
    );
  };

  const handleDataEntryCloseButtonClick = () => {
    if (draw) {
      // Remove any drawn features
      const drawnFeatures = draw.getAll();
      if (drawnFeatures.features.length > 0) {
        drawnFeatures.features;
        drawnFeatures.features.forEach((feature) => {
          if (typeof feature.id === "string") {
            draw.delete(feature.id);
          }
        });
      }
    }
    setShowPopup(false);
    setFeedbackPinLatLng(null);
    setShowDataEntryPopup(false);
  };

  const handleDataEntryCancel = () => {
    if (draw) {
      const drawnFeatures = draw.getAll();
      if (drawnFeatures.features.length > 0) {
        drawnFeatures.features.forEach((feature) => {
          if (typeof feature.id === "string") {
            draw.delete(feature.id);
          }
        });
      }
    }
    setFeedbackPinLatLng(null);
    setEditingMode(false);
  };

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

      setAlertData({
        message: "Thank you for your feedback!",
        type: "success",
      });
      setShowAlert(true);
    } catch (error: any) {
      setAlertData({ message: `Error: ${error.message}`, type: "error" });
      setShowAlert(true);
    }
  };

  const handleDataEntrySubmit = async (
    comment: string,
    contactInfo: string | null
  ) => {
    if (drawnFeature) {
      await submitDrawing(
        drawnFeature as unknown as Feature<Geometry>,
        comment,
        contactInfo
      );
    }

    if (draw) {
      // Remove any drawn features
      const drawnFeatures = draw.getAll();
      if (drawnFeatures.features.length > 0) {
        drawnFeatures.features.forEach((feature) => {
          if (typeof feature.id === "string") {
            draw.delete(feature.id);
          }
        });
      }
    }

    if (feedbackPinLatLng) {
      setFeedbacks((prevFeedbacks) => [
        ...prevFeedbacks,
        { ...feedbackPinLatLng, comment },
      ]);
    }

    setShowPopup(false);
    setFeedbackPinLatLng(null);
  };

  const onMapClick = (e: any) => {
    if (editingMode) {
      setFeedbackPinLatLng(e.lngLat);
    } else {
      if (map) {
        const point = e.point;

        let layersToQuery: string[] = [];
        if (map.getLayer("mainlinegreenway-layer")) {
          layersToQuery.push("mainlinegreenway-layer");
        }
        if (map.getLayer("traffic-stress-layer")) {
          layersToQuery.push("traffic-stress-layer");
        }

        const features = map.queryRenderedFeatures(point, {
          layers: layersToQuery,
        });

        if (
          features.length > 0 &&
          !feedbacks.find(
            (feedback) =>
              feedback.lat === e.lngLat.lat && feedback.lng === e.lngLat.lng
          )
        ) {
          setClickedGeoJSONFeature(
            features[0] as unknown as Feature<AllGeoJSON>
          );
          setPopupInfo(e.lngLat);
          setShowPopup(true);
        } else {
          setShowPopup(false);
        }
      }
    }
  };

  return (
    <ReactMapGL
      initialViewState={viewport}
      style={{
        width: "100vw",
        height: "100vh",
        cursor: cursorStyle,
      }}
      mapStyle={mapStyle}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      onMoveEnd={(e: any) => {
        setViewport({
          longitude: e.target.getCenter().lng,
          latitude: e.target.getCenter().lat,
          zoom: e.target.getZoom(),
        });
      }}
      onLoad={(e) => onMapLoad(e.target)}
      onMouseMove={(e) => {
        if (map && isLayerReady) {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["mainlinegreenway-layer", "traffic-stress-layer"],
          });
          const overFeature = features.length > 0;
          setCursorStyle(overFeature ? "pointer" : "default");
        }
      }}
      onClick={onMapClick}
    >
      <Source
        id="mainlinegreenway"
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
              ...Object.entries(MLGMapping).flatMap(([key, value]) => [
                key,
                value,
              ]),
              "#000", // Default color
            ],
            "line-width": 3,
          }}
        />
      </Source>
      <Source
        id="traffic-stress-layer"
        type="geojson"
        data="/data/trafficStress.geojson"
      >
        {trafficStressLayerVisible && (
          <Layer
            id="traffic-stress-layer"
            type="line"
            paint={{
              "line-color": [
                "match",
                ["get", "linklts"],
                ...Object.entries(LTSMapping).flatMap(([key, value]) => [
                  key,
                  value,
                ]),
                "#000", // Default color
              ],
              "line-width": 1,
            }}
          />
        )}
      </Source>

      {showPopup && popupInfo && (
        <FeaturePopup
          latitude={popupInfo.lat}
          longitude={popupInfo.lng}
          onClose={() => setShowPopup(false)}
          clickedGeoJSONFeature={clickedGeoJSONFeature}
        />
      )}
      <RouteFeedbackButton
        onClick={() => {
          if (draw) {
            draw.changeMode("draw_point");
            setEditingMode(true);
            setFeedbackPinLatLng(null);
            setShowDataEntryPopup(false);
          }
        }}
        active={editingMode}
      >
        Route Feedback
      </RouteFeedbackButton>

      {feedbackPinLatLng && (
        <div style={{ translate: "transform(-50%, -100%)" }}>
          <Marker
            latitude={feedbackPinLatLng.lat}
            longitude={feedbackPinLatLng.lng}
          >
            <FiMapPin className="text-red-600" size={30} />
          </Marker>
        </div>
      )}

      {showDataEntryPopup && feedbackPinLatLng && (
        <CustomDataEntryPopup
          latitude={feedbackPinLatLng.lat}
          longitude={feedbackPinLatLng.lng}
          onClose={() => setShowDataEntryPopup(false)}
          onSubmit={handleDataEntrySubmit}
          onCloseButtonClick={handleDataEntryCloseButtonClick}
          onCancel={handleDataEntryCancel}
        />
      )}
      <NavigationControl showCompass={false} />
      <Legend trafficStressLayerVisible={trafficStressLayerVisible} />
      {showAlert && (
        <Alert
          message={alertData.message}
          type={alertData.type}
          onClose={() => setShowAlert(false)}
        />
      )}
      {feedbacks.map((feedback, index) => (
        <div key={index} style={{ transform: "translate(-50%, -100%)" }}>
          <Marker latitude={feedback.lat} longitude={feedback.lng}>
            <div className="cursor-pointer hover:cursor-pointer">
              <FiMapPin
                className="text-red-600"
                size={30}
                onClick={(e) => {
                  e.stopPropagation();

                  setPopupInfo({ lat: feedback.lat, lng: feedback.lng });
                  setClickedGeoJSONFeature({
                    type: "Feature",
                    properties: { comment: feedback.comment },
                    geometry: {
                      type: "Point",
                      coordinates: [feedback.lng, feedback.lat],
                    },
                  });
                  setShowPopup(true);
                }}
              />
            </div>
          </Marker>
        </div>
      ))}
      <div className="absolute left-0 bottom-5 m-4 z-10">
        <LayerControl
          onStyleChange={(newStyle) => setMapStyle(newStyle)}
          onTrafficStressLayerToggle={(isVisible) =>
            setTrafficStressLayerVisible(isVisible)
          }
          trafficStressLayerVisible={trafficStressLayerVisible}
        />
      </div>
    </ReactMapGL>
  );
};
