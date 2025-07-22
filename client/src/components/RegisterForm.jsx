import { useState } from "react";
import api from "../api";
import React from 'react';

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/register", { email, password });
      setMessage("Registered! You can now log in.");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="p-4 border rounded space-y-2">
      <h2 className="font-bold text-lg">Register</h2>
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
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Register
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
