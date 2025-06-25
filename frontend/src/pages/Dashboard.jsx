import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Last month");
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("dashboard");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileBtnRef = useRef(null);
    const profileMenuRef = useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) {
            const dropdown = document.getElementById("dropdownMenu");
            const button = document.getElementById("dropdownDefaultButton");
            if (
                dropdownOpen &&
                dropdown &&
                !dropdown.contains(event.target) &&
                button &&
                !button.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    const categories = ["Last month", "Last 3 months", "Last year", "All-time"];

    return (
        <div>
            <img
                src="/XPLogo.png"
                alt="Logo"
                className="absolute top-5 left-4 w-36 h-auto"
                style={{ zIndex: 10 }}
            />
            <h1 className="text-white text-3xl mb-10 font-bold">Welcome back</h1>
            <div className="flex space-x-4">
                <div className="bg-neutral-950 w-1/3 h-80 rounded-xl flex flex-col">
                    <div className="flex items-center justify-between px-8 pt-8">
                        <h2 className="text-white text-1xl">
                            Top Games Played
                        </h2>
                        <div className="relative">
                            <button
                                id="dropdownDefaultButton"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="text-neutral-500 bg-transparent border-2 border-neutral-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                                type="button"
                            >
                                {selectedCategory}
                                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                            <div
                                id="dropdownMenu"
                                className={`z-10 ${dropdownOpen ? "" : "hidden"} absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}
                            >
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                    {categories.map((cat) => (
                                        <li key={cat}>
                                            <button
                                                className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={() => {
                                                    setSelectedCategory(cat);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-950 w-2/3 h-80 rounded-xl ">
                </div>
            </div>
        </div>
    );
}

function GameLibrary() {
    return (
        <div>
        </div>
    );
}

function Support() {
    return (
        <div>
        </div>
    );
}

function Dashboard() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("dashboard");

    const renderContent = () => {
        switch (activePage) {
            case "dashboard":
                return <Main />;
            case "library":
                return <GameLibrary />;
            case "support":
                return <Support />;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-black flex flex-col">
            {/* Topbar */}
            <div className="w-full h-20 bg-neutral-900 text-neutral-500 flex justify-center px-8 space-x-8 shadow-md">
                <button
                    onClick={() => setActivePage("dashboard")}
                    className={`text-lg transition-colors duration-200 ${activePage === "dashboard" ? "text-white underline underline-offset-8" : "hover:text-white"
                        }`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setActivePage("library")}
                    className={`text-lg transition-colors duration-200 ${activePage === "library" ? "text-white underline underline-offset-8" : "hover:text-white"
                        }`}
                >
                    Game Library
                </button>
                <button
                    onClick={() => setActivePage("support")}
                    className={`text-lg transition-colors duration-200 ${activePage === "support" ? "text-white underline underline-offset-8" : "hover:text-white"
                        }`}
                >
                    Support
                </button>

                <div className="w-96 px-11 flex justify-center items-center">
                    <input
                        type="search"
                        className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-200 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-primary justify-center border-x-2 border-y-2"
                        id="exampleSearch"
                        placeholder="Type here to search..."
                    />
                </div>

                <button
                    className="absolute right-8 mt-4 w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-neutral-700 hover:border-fuchsia-700 transition"
                    aria-label="Profile"
                >
                    <img
                        src="/PlaceholderProfile.png"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">{renderContent()}</div>
        </div>
    );
}

export default Dashboard;