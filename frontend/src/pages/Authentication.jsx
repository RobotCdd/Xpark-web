import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Authentication() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/send-verification-email/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 404) {
      setAuthError("Email not found.");
      return;
    }
    if (res.ok) {
      navigate("/Verify", { state: { email } });
    } else {
      setAuthError("Email not found.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-black text-white flex flex-col justify-center px-20">
        <img
          src="/static/XPLogo.png"
          alt="Logo"
          className="absolute top-4 left-4 w-36 h-auto"
          style={{ zIndex: 10 }}
        />
        
        <div className="flex mb-6">
          <button onClick={() => navigate("/")} className="text-white hover:underline">
            ← Go back
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-8">
          Let's get you a new password
        </h2>

        <p className="text-1x1 mb-8">
            Because brains are for quests, not remembering passwords.
        </p>

        <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm mb-1">Email address</label>
          <input
            type="text"
            placeholder = "Enter your email" className="w-full px-4 py-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none border-2 text-white bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {authError && (
            <div className="text-red-500 text-sm mb-2">{authError}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-fuchsia-700 text-white py-2 rounded-md hover:bg-fuchsia-900 transition duration-300 mb-1 mt-2"
        >
          Get Verification Code
        </button>
        </form>

        <div className="flex justify-center">
          <p className="text-1x1">
            Already have an account? 
          </p>

          <button
            onClick={() => navigate("/")}
            type="submit"
            className="text-blue-700 px-2 hover:underline"
            disabled={loading}
          >
            Sign in
          </button>
        </div>
      </div>

      <div className="w-1/2 h-screen relative">
        <img src="/static/XparkBackdrop.jpg"
        alt="Login"
        className="w-full h-full object-cover"
        style={{ zIndex: 0 }}
        />
      </div>
    </div>
  );
}

export default Authentication;