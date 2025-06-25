import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Verification() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [codeError, setCodeError] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/verify-code/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (data.success) {
      navigate("/Update", { state: { email } });
    } else {
      setCodeError("Code does not match or has expired.");
    }
  };

  return(
    <div className="flex h-screen">
      
      <div className="w-1/2 bg-black text-white flex flex-col justify-center px-20">

        <img
          src="/XPLogo.png"
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
          Verification
        </h2>

        <p className="text-1x1 mb-8">
            We sent you a reset code - check your email and drop it here.
        </p>

        <div className="mb-8">
          <input
            type="text"
            placeholder = "Enter the code" className="w-full px-4 py-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none border-2 text-white bg-transparent"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {codeError && (
            <div className="text-red-500 text-sm mb-2">{codeError}</div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-fuchsia-700 text-white py-2 rounded-md hover:bg-fuchsia-900 transition duration-300 mb-1 mt-2"
          required
        >
          Submit
        </button>

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

export default Verification;
