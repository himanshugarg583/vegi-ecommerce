import React, { useState, useRef, useEffect } from "react";
import { Check, Clock, Funnel } from "lucide-react";

function Filter() {
  const [status, setStatus] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { label: "All Orders", value: "all", icon: <Funnel /> },
    { label: "Completed", value: "completed", icon: <Check /> },
    { label: "Pending", value: "pending", icon: <Clock /> },
  ];

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-44 text-zinc-500 " ref={dropdownRef}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow flex items-center justify-between hover:text-black"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex gap-2">
          {options.find((o) => o.value === status).icon}
          {options.find((o) => o.value === status).label}
        </div>
        <span>▼</span>
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
              role="option"
              onClick={() => {
                setStatus(option.value);
                setIsOpen(false); // close after selection
              }}
            >
              {option.icon}
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Filter;
