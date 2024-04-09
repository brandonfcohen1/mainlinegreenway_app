interface LayerControlProps {
  onStyleChange: (style: string) => void;
  onTrafficStressLayerToggle: (isVisible: boolean) => void;
  trafficStressLayerVisible: boolean;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  onStyleChange,
  onTrafficStressLayerToggle,
  trafficStressLayerVisible,
}) => {
  return (
    <div className="bg-gray-700 p-2 rounded shadow-lg text-white">
      <div className="mb-2 flex items-center justify-between">
        <label className="mb-1 text-xs">Base Map</label>
        <select
          className="bg-white text-black rounded p-1 text-xs"
          onChange={(e) => onStyleChange(e.target.value)}
        >
          <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
          <option value="mapbox://styles/mapbox/outdoors-v11">Outdoors</option>
          <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
        </select>
      </div>

      <div>
        <label className="inline-flex items-center text-xs">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-green-600"
            checked={trafficStressLayerVisible}
            onChange={(e) => onTrafficStressLayerToggle(e.target.checked)}
          />
          <span className="ml-1">Show Traffic Stress</span>
        </label>
      </div>
    </div>
  );
};
