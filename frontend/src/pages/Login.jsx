import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("right");

  const images = [
    "/static/XparkBackdrop.jpg",
    "/static/Stats.png",
    "/static/VR.png",
    "/static/Keyboard.png",
  ];

  const nextImage = () => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection("left");
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const navigate = useNavigate();

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      navigate("/Dashboard");
    } else {
      setLoginError("Email or password is incorrect.");
    }
  };

  const getInputClass = (value) => {
    if (submitted && value.trim() === '') {
      return "w-full px-4 py-2 rounded-md outline-none border-2 text-white bg-transparent border-red-500 focus:ring-2 focus:ring-red-500";
    }
    return "w-full px-4 py-2 rounded-md outline-none border-2 text-white bg-transparent border-gray-400 focus:ring-2";
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

        <h2 className="text-3xl font-bold mb-8">
          Welcome back
        </h2>

        <p className="text-1x1 mb-8">
            Welcome back! Please enter your details.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="text"
              placeholder="Enter your email"
              className={getInputClass(email)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              className={getInputClass(password)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginError && (
            <div className="text-red-500 text-sm mb-4">{loginError}</div>
            )}
          </div>

          <div className="flex mb-4">
            <input className="mr-2" type="checkbox"
              id="remember" name="remember" value="remember"
            />
            <label htmlFor="remember" className=" select-none">
              Remember me for 30 days
            </label>

            <button
              onClick={() => navigate("/Authentication")}
              type="button"
              className="text-blue-700 px-32 hover:underline"
            >
              Forgot password
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-fuchsia-700 text-white py-2 rounded-md hover:bg-fuchsia-900 transition duration-300 mb-1 mt-2 flex items-center justify-center"
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

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

      </div>

      <div className="w-1/2 h-screen relative overflow-hidden">
        <div className="absolute bottom-16 right-16 flex gap-4 z-10">
          <button
            onClick={prevImage}
            className="bg-black bg-opacity-0 text-white rounded-full border-2 border-gray-500 p-4 hover:bg-opacity-80 transition mr-3 scale-x-110"
            aria-label="Previous"
          >
            &#8592;
          </button>
          <button
            onClick={nextImage}
            className="bg-black bg-opacity-0 text-white rounded-full border-2 border-gray-500 p-4 hover:bg-opacity-80 transition scale-x-110"
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
        <img
          src={images[current]}
          alt="Login"
          className="w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
      </div>

    </div>
  );
}

export default Login;