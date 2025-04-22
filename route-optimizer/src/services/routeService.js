import axios from "axios";

// Get lat/lon from place name using OpenStreetMap Nominatim
export const getCoordinates = async (place) => {
  const res = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`
  );
  const { lat, lon } = res.data[0];
  return [parseFloat(lon), parseFloat(lat)];
};

// Get route from OpenRouteService, including directions, distance, and duration
export const getRoute = async (srcCoords, destCoords) => {
  const apiKey = "5b3ce3597851110001cf624896c33a9d3a2341c8b17fd3d64e302951"; // Replace with your key

  const response = await axios.post(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      coordinates: [srcCoords, destCoords],
    },
    {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  // Extract route data
  const routeData = response.data;
  const routeInstructions = routeData.features[0].properties.segments[0].steps;
  const distance = routeData.features[0].properties.summary.distance / 1000; // in kilometers
  const duration = routeData.features[0].properties.summary.duration / 60; // in minutes

  // Return detailed route information
  return { routeData, routeInstructions, distance, duration };
};
