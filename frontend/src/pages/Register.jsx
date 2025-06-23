import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send email to backend
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-black text-white flex flex-col justify-center px-20">
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
          </div>

          <button
            onClick={() => navigate("/Verification")}
            type="submit"
            className="w-full bg-fuchsia-700 text-white py-2 rounded-md hover:bg-fuchsia-900"
          >
            Get Verification Code
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
