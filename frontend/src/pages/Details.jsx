import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Details() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-black text-white flex flex-col justify-center px-20">
        <div className="flex mb-6">
          <button onClick={() => navigate("/Register")} className="text-white hover:underline">
            ← Go back
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-8">
          Welcome!
        </h2>

        <p className="text-1x1 mb-8">
            Please enter your details.
        </p>

        <div className="mb-6">
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            placeholder = "Enter your username" className="w-full px-4 py-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none border-2 text-white bg-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder = "Password" className="w-full px-4 py-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none border-2 text-white bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Re-enter password</label>
          <input
            type="password"
            placeholder = "Password" className="w-full px-4 py-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none border-2 text-white bg-transparent"
            required
          />
        </div>

        <button
          onClick={() => navigate("/")}
          type="submit"
          className="w-full bg-fuchsia-700 text-white py-2 rounded-md hover:bg-fuchsia-900 transition duration-300 mb-1 mt-2"
        >
          Register
        </button>

        <div className="flex justify-center">
          <p className="text-1x1">
            Already have an account? 
          </p>

          <button
            onClick={() => navigate("/")}
            type="submit"
            className="text-blue-700 px-2 hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>

      <div>

      </div>
    </div>
  );
}

export default Details;