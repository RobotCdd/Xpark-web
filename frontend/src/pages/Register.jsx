import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/send-verification-email/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 404) {
      setRegisterError("Email not found.");
      return;
    }
    if (res.ok) {
      navigate("/Verification", { state: { email } });
    } else {
      setRegisterError("Email not found.");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-black text-white flex flex-col justify-center px-20">
        <img
          src="/XPLogo.png"
          alt="Logo"
          className="absolute top-4 left-4 w-36 h-auto"
          style={{ zIndex: 10 }}
        />

        <div className="flex mb-6">
          <button onClick={() => navigate("/")} className="text-white hover:underline">
            ← Go back
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-8">Welcome</h2>
        <p className="text-1x1 mb-4">Verify your email address to create an account.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-400 rounded-md text-white bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {registerError && (
              <div className="text-red-500 text-sm mb-4">{registerError}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-fuchsia-700 text-white py-2 rounded-md hover:bg-fuchsia-900"
            disabled={loading}
          >
            Get Verification Code
          </button>
        </form>
      </div>

      <div className="w-1/2 h-screen relative">
        <img src="/XparkBackdrop.jpg"
        alt="Login"
        className="w-full h-full object-cover"
        style={{ zIndex: 0 }}
        />
      </div>
    </div>
  );
}

export default Register;
