import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing default marker icons in some bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
});

// Utility to set map bounds dynamically
const FitBoundsToMarkers = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
};

// Colored marker icons by status
const getColoredIcon = (status) => {
  let color = "blue"; // default
  if (status === "Open") color = "red";
  else if (status === "Closed") color = "orange";
  else if (status === "Resolved") color = "green";

  return new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=flag|${color}`,
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -40],
  });
};

const JanmatMapView = ({ issues = [] }) => {
  const [showMap, setShowMap] = useState(false);

  const validIssues = issues.filter(
    (issue) =>
      issue.latitude &&
      issue.longitude &&
      !isNaN(Number(issue.latitude)) &&
      !isNaN(Number(issue.longitude))
  );

  const markers = validIssues.map((i) => [Number(i.latitude), Number(i.longitude)]);

  return (
    <div style={{ marginBottom: 40 }}>
      <button
        onClick={() => setShowMap(!showMap)}
        style={{
          background: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: 10,
          cursor: "pointer",
          marginBottom: 10,
        }}
      >
        {showMap ? "Hide Map 🗺️" : "View on Map 🗺️"}
      </button>

      {showMap && (
        <MapContainer
          center={[20.5937, 78.9629]} // India center
          zoom={5}
          style={{ height: 520, width: "100%", borderRadius: 12 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBoundsToMarkers markers={markers} />

          {validIssues.length > 0 ? (
            validIssues.map((issue) => (
              <Marker
                key={issue.id}
                position={[Number(issue.latitude), Number(issue.longitude)]}
                icon={getColoredIcon(issue.status)}
              >
                <Popup>
                  <b>{issue.title}</b>
                  <br />
                  📂 {issue.category || "General"}
                  <br />
                  🏷️ {issue.status}
                </Popup>
              </Marker>
            ))
          ) : (
            <Popup position={[20.5937, 78.9629]}>
              No valid issue locations to display.
            </Popup>
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default JanmatMapView;
