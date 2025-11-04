import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./IssueForm.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
});

export default function IssueForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    latitude: null,
    longitude: null,
  });
  const [message, setMessage] = useState("");

  // ✅ Get GPS coordinates automatically
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
        },
        (err) => console.warn("⚠️ Location access denied:", err.message)
      );
    }
  }, []);

  // ✅ Convert location text → coordinates
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!formData.location.trim()) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            formData.location
          )}`
        );
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          }));
        }
      } catch (error) {
        console.error("❌ Error fetching coordinates:", error);
      }
    };

    const timeout = setTimeout(fetchCoordinates, 1000);
    return () => clearTimeout(timeout);
  }, [formData.location]);

  // ✅ Update form data when marker dragged
  const DraggableMarker = () => {
    const [position, setPosition] = useState([
      formData.latitude,
      formData.longitude,
    ]);

    useMapEvents({
      click(e) {
        // click anywhere on map → move marker there
        setPosition([e.latlng.lat, e.latlng.lng]);
        setFormData((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });

    return (
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const pos = marker.getLatLng();
            setPosition([pos.lat, pos.lng]);
            setFormData((prev) => ({
              ...prev,
              latitude: pos.lat,
              longitude: pos.lng,
            }));
          },
        }}
      >
        <Popup>📍 Drag to adjust location</Popup>
      </Marker>
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      await axios.post("issues/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Issue submitted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        latitude: null,
        longitude: null,
      });
    } catch (err) {
      setMessage("❌ Failed to submit issue. Please login first.");
      console.error(err);
    }
  };

  return (
    <div className="issue-form-container">
      <h2>📝 Report an Issue</h2>
      <form onSubmit={handleSubmit} className="issue-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="road">Road Damage</option>
          <option value="waste">Waste</option>
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
          <option value="other">Other</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Enter location (e.g. MG Road, Indore)"
          value={formData.location}
          onChange={handleChange}
          required
        />

        {formData.latitude && formData.longitude && (
          <>
            <p className="coords">
              📍 Lat: {formData.latitude.toFixed(4)} | Lon:{" "}
              {formData.longitude.toFixed(4)}
            </p>

            <div className="map-container">
              <MapContainer
                center={[formData.latitude, formData.longitude]}
                zoom={15}
                scrollWheelZoom={true}
                style={{
                  height: "320px",
                  width: "100%",
                  borderRadius: "12px",
                  marginTop: "10px",
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker />
              </MapContainer>
            </div>
          </>
        )}

        <button type="submit">Submit Issue 🚀</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
