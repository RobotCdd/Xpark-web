import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main({ user }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Last month");
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("dashboard");

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
            <h1 className="text-white text-3xl mb-10 font-bold">
                {user ? `Welcome back, ${user.name}` : "Welcome back"}
            </h1>
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

function EditProfile({ user, onProfileUpdated }) {
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        city: user?.city || "",
        state: user?.state || "",
        student_id: user?.student_id || "",
        year_group: user?.year_group || "",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            city: user?.city || "",
            state: user?.state || "",
            student_id: user?.student_id || "",
            year_group: user?.year_group || "",
        });
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem("access");
        const res = await fetch("http://127.0.0.1:8000/users/me/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(form),
        });
        setSaving(false);
        if (res.ok) {
            const updated = await res.json();
            if (onProfileUpdated) onProfileUpdated(updated);
            alert("Profile updated!");
        } else {
            alert("Failed to update profile.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-neutral-900 rounded-xl p-8 shadow-lg relative">
            <button
                type="submit"
                form="edit-profile-form"
                className="absolute top-6 right-8 bg-fuchsia-700 hover:bg-fuchsia-900 text-white px-6 py-2 rounded font-semibold"
                disabled={saving}
            >
                {saving ? "Saving..." : "Save"}
            </button>
            <h2 className="text-white text-2xl font-bold mb-8 flex justify-center">Personal info</h2>
            <form
                id="edit-profile-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-x-12 gap-y-6"
                autoComplete="off"
            >
                <div className="flex flex-col items-center col-span-1">
                    <img
                        src="/PlaceholderProfile.png"
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-white object-cover mb-4"
                    />
                    <div className="text-2xl text-white font-bold mb-1">{form.name}</div>
                    <div className="text-neutral-400 mb-6">{form.email}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 col-span-1">
                    <div>
                        <label className="block text-neutral-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded bg-neutral-800 text-white px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-neutral-400 mb-1">Display Name</label>
                        <input
                            type="text"
                            name="display_name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded bg-neutral-800 text-white px-3 py-2"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-neutral-400 mb-1">Phone number</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full rounded bg-neutral-800 text-white px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-neutral-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded bg-neutral-800 text-white px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-neutral-400 mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full rounded bg-neutral-800 text-white px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-neutral-400 mb-1">State</label>
                        <input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className="w-full rounded bg-neutral-800 text-white px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-neutral-400 mb-1">Student ID</label>
                        <input
                            type="text"
                            name="student_id"
                            value={form.student_id}
                            onChange={handleChange}
                            className="w-full rounded bg-neutral-800 text-white px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-neutral-400 mb-1">Year group</label>
                        <input
                            type="text"
                            name="year_group"
                            value={form.year_group}
                            onChange={handleChange}
                            className="w-full rounded bg-neutral-800 text-white px-3 py-2"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

function Dashboard() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState("dashboard");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileBtnRef = useRef(null);
    const profileMenuRef = useRef(null);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access");
        fetch("http://127.0.0.1:8000/users/me/", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => setUser(data));
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                profileDropdownOpen &&
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target) &&
                profileBtnRef.current &&
                !profileBtnRef.current.contains(event.target)
            ) {
                setProfileDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileDropdownOpen]);


    const renderContent = () => {
        switch (activePage) {
            case "dashboard":
                return <Main user={user} />;
            case "library":
                return <GameLibrary />;
            case "support":
                return <Support />;
            case "edit-profile":
                return <EditProfile user={user} onProfileUpdated={setUser} />;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-black flex flex-col">
            {/* Topbar */}
            <div className="w-full h-20 bg-neutral-900 text-neutral-500 flex justify-center px-8 space-x-8 shadow-md">
                <img
                    src="/XPLogo.png"
                    alt="Logo"
                    className="absolute top-5 left-4 w-36 h-auto"
                    style={{ zIndex: 10 }}
                />
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
                    ref={profileBtnRef}
                    className="absolute right-8 mt-4 w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-neutral-700 hover:border-fuchsia-700 transition"
                    aria-label="Profile"
                     onClick={() => setProfileDropdownOpen((prev) => !prev)}
                >
                    <img
                        src="/PlaceholderProfile.png"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </button>
                {profileDropdownOpen && (
                    <div
                        ref={profileMenuRef}
                        className="absolute right-0 top-20 mt-2 w-1/4 h-5/6 bg-neutral-900 bg-opacity-50 rounded-lg shadow-lg z-50"
                    >
                        <div className="flex flex-col items-center p-4">
                            <img
                                src="/PlaceholderProfile.png"
                                alt="Profile"
                                className="w-48 h-48 rounded-full border-4 border-white object-fill mb-2"
                            />
                            <div className="text-white font-semibold mb-1">
                                {user ? user.name : "Name"}
                            </div>
                            <div className="text-neutral-400 text-sm mb-3">
                                {user ? user.email : "email@example.com"}
                            </div>
                            <button
                                className="w-full bg-fuchsia-700 hover:bg-fuchsia-900 text-white px-4 py-2 rounded mb-2 p-0 m-0"
                                onClick={() => {
                                    setProfileDropdownOpen(false);
                                    setActivePage("edit-profile");
                                }}
                            >
                                Edit Profile
                            </button>
                            <button
                                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    setProfileDropdownOpen(false);
                                    localStorage.removeItem("access");
                                    localStorage.removeItem("refresh");
                                    navigate("/");
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">{renderContent()}</div>
        </div>
    );
}

export default Dashboard;