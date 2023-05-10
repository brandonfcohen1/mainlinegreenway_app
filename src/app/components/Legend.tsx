import { MLGMapping } from "../utils/mappings";

export const Legend = () => {
  return (
    <div className="legend">
      {Object.entries(MLGMapping).map(([key, { style, description }]) => (
        <div key={key}>
          <span className="legend-key" style={style}></span>
          {description}
        </div>
      ))}
    </div>
  );
};
