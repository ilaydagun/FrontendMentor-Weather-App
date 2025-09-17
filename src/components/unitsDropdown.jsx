import { useState, useRef, useEffect } from "react";

function UnitsDropdown({ units, setUnits, className }) {
  const [open, setOpen] = useState(false);
  const [unitSystem, setUnitSystem] = useState("metric");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (unitSystem === "metric") {
      setUnits({
        temperature: "celsius",
        windSpeed: "km/h",
        precipitation: "mm",
      });
    } else {
      setUnits({
        temperature: "fahrenheit",
        windSpeed: "mph",
        precipitation: "inches",
      });
    }
  }, [unitSystem]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={`dropdown ${className || ""}`} ref={dropdownRef}>
      <button className="dropdown-button" onClick={() => setOpen(!open)}>
        <img className="settings-icon" src="icon-units.svg" alt="Settings" />{" "}
        Units <img className="down-arrow" src="icon-dropdown.svg" alt="Units" />
      </button>
      {open && (
        <div className="dropdown-menu">
          <button
            className="dropdown-item"
            onClick={() =>
              setUnitSystem(unitSystem === "metric" ? "imperial" : "metric")
            }
          >
            Switch to {unitSystem === "metric" ? "Imperial" : "Metric"}
          </button>
          <div className="dropdown-section">Temperature</div>
          <button
            className={`dropdown-item ${
              units.temperature === "celsius" ? "active" : ""
            }`}
            onClick={() => setUnits({ ...units, temperature: "celsius" })}
          >
            Celsius (°C)
          </button>
          <button
            className={`dropdown-item ${
              units.temperature === "fahrenheit" ? "active" : ""
            }`}
            onClick={() => setUnits({ ...units, temperature: "fahrenheit" })}
          >
            Fahrenheit (°F)
          </button>

          <div className="dropdown-section">Wind Speed</div>
          <button
            className={`dropdown-item ${
              units.windSpeed === "km/h" ? "active" : ""
            }`}
            onClick={() => setUnits({ ...units, windSpeed: "km/h" })}
          >
            km/h
          </button>
          <button
            className={`dropdown-item ${
              units.windSpeed === "mph" ? "active" : ""
            }`}
            onClick={() => setUnits({ ...units, windSpeed: "mph" })}
          >
            mph
          </button>

          <div className="dropdown-section">Precipitation</div>
          <button
            className={`dropdown-item ${
              units.precipitation === "mm" ? "active" : ""
            }`}
            onClick={() => setUnits({ ...units, precipitation: "mm" })}
          >
            Millimeters (mm)
          </button>
          <button
            className={`dropdown-item ${
              units.precipitation === "inches" ? "active" : ""
            }`}
            onClick={() => setUnits({ ...units, precipitation: "inches" })}
          >
            Inches (in)
          </button>
        </div>
      )}
    </div>
  );
}

export default UnitsDropdown;
