import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/user/")
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="profile-container">Loading profile...</div>;
  if (!profile) return <div className="profile-container">No profile data.</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 {profile.username}</h2>
        <p>Email: {profile.email}</p>
        <p>Role: {profile.is_staff ? "Admin" : "Citizen"}</p>
        <p>Total Issues Submitted: {profile.total_issues}</p>
      </div>

      <div className="issues-section">
        <h3>Your Reported Issues</h3>
        {profile.issues.length === 0 ? (
          <p>No issues submitted yet.</p>
        ) : (
          <table className="issues-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {profile.issues.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.title}</td>
                  <td>
                    <span className={`status ${issue.status.toLowerCase()}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Profile;
