import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-black text-white flex flex-col justify-center px-20">

        <h2 className="text-3xl font-bold mb-8">
          Welcome back
        </h2>

        <p className="text-1x1 mb-8">
            Welcome back! Please enter your details.
        </p>

        <div className="mb-8">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="text"
            placeholder = "Enter your email" className="w-full px-4 py-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none border-2 text text-white bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div className="flex">
          <p className="text-1x1 mb-5">
            Remember me for 30 days
          </p>

          <button
           onClick={() => navigate("/Authentication")}
           type="submit"
           className="text-blue-700 mb-5 px-32 hover:underline"
          >
            Forgot password
          </button>
        </div>

        <button
          onClick={() => navigate("/Dashboard")}
          type="submit"
          className="w-full bg-fuchsia-700 text-white py-2 rounded-md hover:bg-fuchsia-900 transition duration-300 mb-1 mt-2"
        >
          Sign In
        </button>

        <div className="flex justify-center">
          <p className="text-1x1">
            Are you a new user? 
          </p>

          <button
            onClick={() => navigate("/Register")}
            type="submit"
            className="text-blue-700 px-2 hover:underline"
          >
            Register here
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/Edit")}
            type="submit"
            className="text-blue-700 px-2 hover:underline"
          >
            Admin placeholder
          </button>
        </div>
      </div>

      <div>

      </div>
    </div>
  );
}

export default Login;