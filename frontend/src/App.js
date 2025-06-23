import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Verification from "./pages/Verification"
import Dashboard from "./pages/Dashboard"
import Details from "./pages/Details"
import Authentication from "./pages/Authentication";
import Verify from "./pages/Verify";
import Update from "./pages/Update";
import Edit from "./pages/Edit";
import Action from "./pages/EditUser";

function App() {
  return (
        <>
            <Router>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Login />}
                    />
                    <Route
                        path="/Register"
                        element={<Register />}
                    />
                    <Route
                        path="/Verification"
                        element={<Verification />}
                    />
                    <Route
                        path="/Dashboard"
                        element={<Dashboard />}
                    />
                    <Route
                        path="/Details"
                        element={<Details />}
                    />
                    <Route
                        path="/Authentication"
                        element={<Authentication />}
                    />
                    <Route
                        path="/Verify"
                        element={<Verify />}
                    />
                    <Route
                        path="/Update"
                        element={<Update />}
                    />
                    <Route
                        path="/Edit"
                        element={<Edit />}
                    />
                    <Route
                        path="/Action/:id"
                        element={<Action />}
                    />
                    {/* Redirect any unmatched routes to the home page */}
                    <Route
                        path="*"
                        element={<Navigate to="/" />}
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;

/*useEffect(() => {
    fetch("http://127.0.0.1:8000/home/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return <h1>{message}</h1>;*/