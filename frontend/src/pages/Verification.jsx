import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Verify() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add fetch POST to Django
  };

  return(
    <div className="flex h-screen">
      
      <div className="w-1/2 bg-black text-white flex flex-col justify-center px-20">
        <div className="flex mb-6">
          <button onClick={() => navigate("/Register")} className="text-white hover:underline">
            ← Go back
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-8">
          Verification
        </h2>

        <p className="text-1x1">
            Please enter the verification code sent to your email address.
          </p>

          <p className="text-1x1 text-blue-700 mb-7 ">
            yourname@example.com
        </p>

        <div className="mb-8">
          <input
            type="text"
            placeholder = "Enter the code" className="w-full px-4 py-2 border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400 outline-none border-2 text-white bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          onClick={() => navigate("/Details")}
          type="submit"
          className="w-full bg-fuchsia-700 text-white py-2 rounded-md hover:bg-fuchsia-900 transition duration-300 mb-1 mt-2"
        >
          Submit
        </button>

      </div>

    </div>
  );
}

export default Verify;
