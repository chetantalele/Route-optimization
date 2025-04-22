// services/routeUpdateService.js
import axios from "axios";

export const getRouteUpdates = async (lat, lng) => {
  try {
    const response = await axios.get(`/api/route-updates?lat=${lat}&lng=${lng}`);
    return response.data;
  } catch (error) {
    console.error("Route updates error:", error);
    return [];
  }
};
