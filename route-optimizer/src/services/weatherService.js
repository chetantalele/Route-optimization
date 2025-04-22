import axios from "axios";

// Fetch weather using latitude and longitude
export const getWeather = async (lat, lon) => {
  try {
    console.log("Latitude:", lat);
    console.log("Longitude:", lon);

    const apiKey = "a87c281750d2efe55aa20f46ef02a960"; // Replace with your own key if needed
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Weather error:", error);
    throw error;
  }
};
