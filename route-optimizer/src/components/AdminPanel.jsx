import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [apiStatus, setApiStatus] = useState({});
  const [routeUpdates, setRouteUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAPIStatus = async () => {
    try {
      const { data } = await axios.get("/api/admin/status-check");
      setApiStatus(data);
    } catch (error) {
      console.error("Failed to fetch API status", error);
    }
  };

  const fetchRouteUpdates = async () => {
    try {
      const { data } = await axios.get("/api/route-updates");
      console.log("Route updates response:", data); // 🔍 Debug line

      // If data is an object with a key like `updates`, extract that
      const updatesArray = Array.isArray(data)
        ? data
        : Array.isArray(data.updates)
        ? data.updates
        : [];

      setRouteUpdates(updatesArray);
    } catch (error) {
      console.error("Failed to fetch route updates", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUpdate = async (id) => {
    try {
      await axios.delete(`/api/route-updates/${id}`);
      setRouteUpdates((prev) => prev.filter((update) => update.id !== id));
    } catch (error) {
      alert("Failed to delete update");
    }
  };

  useEffect(() => {
    fetchAPIStatus();
    fetchRouteUpdates();
  }, []);

  return (
    <div className="admin-panel">
      <h2>🛠️ Admin Panel</h2>

      <section className="api-status-section">
        <h3>🔍 API Health Check</h3>
        <ul>
          {Object.entries(apiStatus).map(([name, status], idx) => (
            <li key={idx} className={status === "OK" ? "ok" : "fail"}>
              <strong>{name}:</strong> {status}
            </li>
          ))}
        </ul>
      </section>

      <section className="route-updates-section">
        <h3>🛣️ Route Updates Table</h3>
        {loading ? (
          <p>Loading route updates...</p>
        ) : routeUpdates.length === 0 ? (
          <p>No route updates available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Message</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {routeUpdates.map((update) => (
                <tr key={update.id}>
                  <td>{update.id}</td>
                  <td>{update.message}</td>
                  <td>{new Date(update.timestamp).toLocaleString()}</td>
                  <td>
                    <button onClick={() => deleteUpdate(update.id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
