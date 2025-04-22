import React, { useState } from "react";
import InputForm from "./components/InputForm";
import MapView from "./components/MapView";
import { getCoordinates, getRoute } from "./services/routeService";
import { getWeather } from "./services/weatherService";
import "./styles.css";
import SubmitUpdatePage from './components/SubmitUpdatePage'; 
import AdminPanel from "./components/AdminPanel";

function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [weather, setWeather] = useState(null);

  const handleRouteFetch = async () => {
    try {
      const srcCoords = await getCoordinates(source);
      const destCoords = await getCoordinates(destination);
      console.log("Source Coordinates:", srcCoords);
      console.log("Destination Coordinates:", destCoords);

      const {
        routeData,
        routeInstructions,
        distance,
        duration,
      } = await getRoute(srcCoords, destCoords);

      setRoute(routeData);
      setInstructions(routeInstructions);
      setDistance(distance);
      setDuration(duration);

      const weatherData = await getWeather(srcCoords[1], srcCoords[0]);
      setWeather({
        city: source,
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
      });
    } catch (error) {
      console.error("Error fetching route:", error);
      alert("Something went wrong while fetching route.");
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    source
  )}&destination=${encodeURIComponent(destination)}`;

  return (

    
    <div className="app-container">
      <h2>🚗 Route Optimization App</h2>

      <div className="form-container">
        <InputForm
          source={source}
          destination={destination}
          setSource={setSource}
          setDestination={setDestination}
          handleRouteFetch={handleRouteFetch}
        />
      </div>

      {distance && duration && (
        <div className="card-container">
          <div className="card">
            <h3>Distance</h3>
            <p>{distance.toFixed(2)} km</p>
          </div>
          <div className="card">
            <h3>Duration</h3>
            <p>{duration.toFixed(2)} minutes</p>
          </div>
        </div>
      )}

      {(weather || instructions.length > 0) && (
        <div className="info-row">
          {weather && (
            <div className="card card-weather">
              <h3>Weather Report</h3>
              <p><strong>{weather.city}</strong></p>
              <p>Temperature: {weather.temperature}°C</p>
              <p>{weather.description}</p>
            </div>
          )}

          {/* Updated layout: Side-by-side cards */}
          <div className="card-container">
            <div className="card card-directions">
              <h3>Turn-by-Turn Instructions</h3>
              <ul>
                {instructions.length > 0 ? (
                  instructions.map((step, index) => (
                    <li key={index}>
                      {step.instruction} (Distance: {step.distance}m)
                    </li>
                  ))
                ) : (
                  <li>No instructions available</li>
                )}
              </ul>
            </div>

            <div className="card card-updates">
              <h3>Route Updates</h3>
              <ul>
                {/* Sample route updates */}
                <li>Traffic congestion ahead</li>
                <li>Accident reported 2 km from your location</li>
                <li>Roadwork expected in 10 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="map-container">
        <MapView route={route} />
      </div>

      {source && destination && (
        <div className="google-maps-button-container">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="google-maps-link"
          >
            <button>View Route on Google Maps</button>
          </a>
        </div>
      )}

      <footer>
        <p>Route Optimization App - Built with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
