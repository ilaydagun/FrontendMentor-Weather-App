import { useState, useRef, useEffect } from "react";

function DaysDropdown({
  selectedDay,
  setSelectedDay,
  availableDays,
  className,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      {/* Button that toggles dropdown */}
      <button className="dropdown-button" onClick={() => setOpen(!open)}>
        {selectedDay || "Select Day"}{" "}
        <img className="down-arrow" src="icon-dropdown.svg" alt="Select day" />
      </button>

      {open && (
        <div className="dropdown-menu">
          {availableDays.map((day) => (
            <button
              key={day}
              className={`dropdown-item ${day === selectedDay ? "active" : ""}`}
              onClick={() => {
                setSelectedDay(day);
                setOpen(false); // close dropdown after selecting
              }}
            >
              {day}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DaysDropdown;
