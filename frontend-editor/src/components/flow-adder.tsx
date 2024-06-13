import React, { useState } from "react";

const FlowAdder: React.FC = () => {
  const [flows, setFlows] = useState<string[]>([]);
  const [newFlow, setNewFlow] = useState("");

  const handleAddFlow = () => {
    if (newFlow.trim() !== "") {
      setFlows((prevFlows) => [...prevFlows, newFlow]);
    }
  };

  return (
    <div className=" mt-2">
      <input
        type="text"
        value={newFlow}
        onChange={(e) => setNewFlow(e.target.value)}
        placeholder="Flow Name"
      />
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        onClick={handleAddFlow}
      >
        Add Flow
      </button>
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        onClick={() => setFlows((prevFlows) => prevFlows.slice(0, -1))}
      >
        Delete Last Flow
      </button>
      {flows.map((flow, index) => (
        <div
          key={index}
          className="max-w-lg mx-auto my-4 p-4 border border-gray-200 rounded-lg shadow-sm"
        >
          <h3 className="text-4xl font-bold text-indigo-600 mt-4 mb-2">
            {flow}
          </h3>
          <div className="mt-2 mb-4">
            <input
              type="text"
              placeholder="Name"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Description"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlowAdder;
