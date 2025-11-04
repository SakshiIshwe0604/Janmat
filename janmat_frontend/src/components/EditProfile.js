import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    setFormData({ username: username || "", email: email || "", password: "" });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.patch("user/update/", formData);
      setMessage("✅ " + res.data.message);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("email", res.data.email);
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      setMessage("❌ Update failed");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input name="username" value={formData.username} onChange={handleChange} />

        <label>Email</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} />

        <label>New Password (optional)</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Save Changes</button>
      </form>
      {message && <p className="msg">{message}</p>}
    </div>
  );
};

export default EditProfile;
