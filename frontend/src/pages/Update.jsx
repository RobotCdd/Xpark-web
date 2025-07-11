import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Update() {
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState('');
  const [rePassword, setRePassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/update-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      navigate("/");
    } else {
      alert("Failed to update password.");
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
          <button onClick={() => navigate("/Authentication")} className="text-white hover:underline">
            ← Go back
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-8">
          Welcome!
        </h2>

        <p className="text-1x1 mb-8">
            We're almost done! Just enter a new password to finish up.
        </p>

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
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            required
          />
          {passwordError && (
            <div className="text-red-500 text-sm mb-2">{passwordError}</div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="w-full bg-fuchsia-700 text-white py-2 rounded-md hover:bg-fuchsia-900 transition duration-300 mb-1 mt-2"
        >
          Reset Password
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

export default Update;