import React, { useState } from "react";

const Collapsible: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-300 rounded-lg w-full p-2">
      {/* Header */}
      <button
        className="w-full flex justify-between items-center px-4 py-2 text-left font-medium bg-gray-100 hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[auto] p-4" : "max-h-0 p-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapsible;
