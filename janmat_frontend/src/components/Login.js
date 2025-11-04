import React, { useState } from "react";
import axios from "../api/axios";
import "./Auth.css";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("token/", formData);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("username", formData.username);
      const userRes = await axios.get("me/");
      const isAdmin = userRes.data.is_staff || userRes.data.is_superuser;
    localStorage.setItem("isAdmin", isAdmin);

    setMessage("✅ Login successful!");
    window.location.href = "/";
    } catch (err) {
      setMessage("❌ Invalid credentials. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
