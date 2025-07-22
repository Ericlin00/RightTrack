import { useState } from "react";
import api from "../api";
import React from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/login", { email, password });
      setMessage("Logged in successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4 border rounded space-y-2">
      <h2 className="font-bold text-lg">Login</h2>
      <input
        className="block w-full p-2 border"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="block w-full p-2 border"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Login
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
