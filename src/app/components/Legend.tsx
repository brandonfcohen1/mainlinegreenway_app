import { MLGMapping, LTSMapping } from "../utils/mappings";

export const Legend = ({
  trafficStressLayerVisible,
}: {
  trafficStressLayerVisible: boolean;
}) => {
  const openTrafficStressLevelLink = () => {
    window.open("https://www.dvrpc.org/webmaps/bike-lts/", "_blank");
  };

  return (
    <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 p-2.5 rounded-md z-10 text-black">
      <h3 className="text-sm font-bold mb-2">Mainline Greenway</h3>
      {Object.entries(MLGMapping).map(([key, value]) => (
        <div key={key} className="flex items-center mb-1">
          <span
            className="legend-key inline-block w-4 h-4 mr-2"
            style={{ backgroundColor: value }}
          ></span>
          {key}
        </div>
      ))}

      <hr className="my-2" />

      {trafficStressLayerVisible && (
        <>
          <h3
            className="text-sm font-bold mb-2 cursor-pointer hover:underline"
            onClick={openTrafficStressLevelLink}
          >
            Traffic Stress Level
          </h3>
          {Object.entries(LTSMapping).map(([key, value]) => (
            <div key={key} className="flex items-center mb-1">
              <span
                className="legend-key inline-block w-4 h-4 mr-2"
                style={{ backgroundColor: value }}
              ></span>
              {key}
            </div>
          ))}
        </>
      )}
    </div>
  );
};
