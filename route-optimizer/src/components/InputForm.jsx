import React from "react";

function InputForm({ source, destination, setSource, setDestination, handleRouteFetch }) {
  return (
    <div>
      <input
        type="text"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="Enter source"
        className="input-field"
      />
      <input
        type="text"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Enter destination"
        className="input-field"
      />
      <button onClick={handleRouteFetch}>Get Route</button>
    </div>
  );
}

export default InputForm;
