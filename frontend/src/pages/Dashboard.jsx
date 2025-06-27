import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from "recharts";

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
            <h1 className="text-white text-3xl mb-7 font-bold">
                {user ? `Welcome back, ${user.name}` : "Welcome back"}
            </h1>
            <DashboardCharts />
            <MyGames />
            <Recommendations />
            <div className="flex space-x-4">
                
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
        });
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem("access");
        const res = await fetch("/api/users/me/", {
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
                        src="/static/PlaceholderProfile.png"
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-white object-cover mb-4"
                    />
                    <div className="text-2xl text-white font-bold mb-1">{form.name}</div>
                    <div className="text-neutral-400 mb-6">{form.email}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 col-span-1">
                    <div>
                        <label className="block text-neutral-400 mb-1">Student ID</label>
                        <p
                            type="text"
                            name="student_id"
                            value={form.student_id}
                            onChange={handleChange}
                            className="w-full rounded bg-neutral-800 text-white px-3 py-2"
                        />
                    </div>
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
                </div>
            </form>
        </div>
    );
}

function DashboardCharts() {
    const [donutData, setDonutData] = useState([]);
    const [barData, setBarData] = useState([]);
    const donutColors = ["#a21caf", "#14b8a6", "#38bdf8", "#a3e635", "#f43f5e"];

    useEffect(() => {
        const token = localStorage.getItem("access");
        fetch("/api/game-stats/", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setDonutData)
            .catch(() => setDonutData([]));

        fetch("/api/bar-stats/", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setBarData)
            .catch(() => setBarData([]));
    }, []);

    const [barTab, setBarTab] = React.useState("All Games");
    const barTabs = ["All Games", "Completed", "Ongoing"];

    const [donutDropdownOpen, setDonutDropdownOpen] = useState(false);
    const [selectedDonutCategory, setSelectedDonutCategory] = useState("Last month");

    const [barDropdownOpen, setBarDropdownOpen] = useState(false);
    const [selectedBarCategory, setSelectedBarCategory] = useState("Category 1");

    useEffect(() => {
        function handleClickOutside(event) {
            const donutDropdown = document.getElementById("donutDropdownMenu");
            const donutButton = document.getElementById("donutDropdownButton");
            const barDropdown = document.getElementById("barDropdownMenu");
            const barButton = document.getElementById("barDropdownButton");

            if (
                donutDropdownOpen &&
                donutDropdown &&
                !donutDropdown.contains(event.target) &&
                donutButton &&
                !donutButton.contains(event.target)
            ) {
                setDonutDropdownOpen(false);
            }
            if (
                barDropdownOpen &&
                barDropdown &&
                !barDropdown.contains(event.target) &&
                barButton &&
                !barButton.contains(event.target)
            ) {
                setBarDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [donutDropdownOpen, barDropdownOpen]);

    const categories = ["Last month", "Last 3 months", "Last year", "All-time"];

    const barCategories = ["Category 1", "Category 2", "Category 3", "Category 4"];

    return (
        <div className="flex gap-6">
        {/* Donut Chart */}
        <div className="bg-neutral-900 rounded-2xl p-6 w-1/3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
            <h2 className="text-white text-lg font-semibold">Top Games played</h2>
                <div className="relative outline-none">
                    <button
                        id="donutDropdownButton"
                        onClick={() => setDonutDropdownOpen((prev) => !prev)}
                        className="w-36 h-8 text-neutral-400 text-xs border-2 border-neutral-700 rounded px-8 py-1 ml-10 flex justify-between items-center"
                        type="button"
                    >
                        <span className="whitespace-normal">{selectedDonutCategory}</span>
                        <span className="ml-0">▼</span>
                    </button>
                    <div
                        id="donutDropdownMenu"
                        className={`z-10 ${donutDropdownOpen ? "" : "hidden"} absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-28 dark:bg-neutral-800 bg-opacity-50 dark:divide-gray-600`}
                    >
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="donutDropdownButton">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        className="w-full text-center block px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-500 dark:hover:text-white"
                                        onClick={() => {
                                            setSelectedDonutCategory(cat);
                                            setDonutDropdownOpen(false);
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
            <div className="flex items-center">
            <PieChart width={200} height={200}>
                <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={0}
                stroke="none"
                >
                {donutData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={donutColors[idx % donutColors.length]} />
                ))}
                </Pie>
            </PieChart>
            <div className="ml-4">
                {donutData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center mb-1">
                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: donutColors[idx] }} />
                    <span className="text-white text-sm">{entry.name}</span>
                    <span className="ml-2 text-neutral-400 text-xs">{entry.value}%</span>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-neutral-900 rounded-2xl p-6 w-2/3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
            <div className="flex gap-4 outline-none">
                {barTabs.map(tab => (
                <button
                    key={tab}
                    className={`text-sm px-2 py-1 rounded ${barTab === tab ? "bg-neutral-800 text-white" : "text-neutral-400"}`}
                    onClick={() => setBarTab(tab)}
                >
                    {tab}
                </button>
                ))}
            </div>
            <div>
                <div className="relative">
                    <button
                        id="barDropdownButton"
                        onClick={() => setBarDropdownOpen((prev) => !prev)}
                        className="w-36 h-8 text-neutral-400 text-xs border-2 border-neutral-700 rounded px-8 py-1 ml-10 flex justify-between items-center"
                        type="button"
                    >
                        <span className="whitespace-normal">{selectedBarCategory}</span>
                        <span className="ml-0">▼</span>
                    </button>
                    <div
                        id="barDropdownMenu"
                        className={`z-10 ${barDropdownOpen ? "" : "hidden"} absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-28 dark:bg-neutral-800 bg-opacity-50 dark:divide-gray-600`}
                    >
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="barDropdownButton">
                            {barCategories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        className="w-full text-center block px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-500 dark:hover:text-white"
                                        onClick={() => {
                                            setSelectedBarCategory(cat);
                                            setBarDropdownOpen(false);
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
            <ResponsiveContainer width="100%" height={225}>
            <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#fff" tickline={false} />
                <YAxis stroke="#fff" domain={[0, 100]} tickFormatter={v => `${v}%`} tickline={false} />
                <Tooltip />
                <Bar 
                    dataKey="percent"
                    barSize={30}
                    radius={[8, 8, 8, 8]}
                >
                {barData.map((entry, idx) => (
                    <Cell key={`bar-${idx}`} fill={entry.color} />
                ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
}

function MyGames() {
    const [games, setGames] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("access");
        fetch("/api/user-game-stats/", {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const uniqueGames = [];
                const seen = new Set();
                data.forEach(stat => {
                    if (stat.game && !seen.has(stat.game.id)) {
                        seen.add(stat.game.id);
                        uniqueGames.push(stat.game);
                    }
                });
                setGames(uniqueGames);
            });
    }, []);

    return (
        <div>
            <h2 className="text-white text-2xl font-bold mt-6 mb-4">My games</h2>
            <div className="flex overflow-x-auto space-x-6 pb-2 hide-scrollbar">
                {games.map((game, idx) => (
                    <div
                        key={game.id || idx}
                        className="min-w-[160px] max-w-[160px] bg-neutral-800 rounded-lg shadow-md flex flex-col items-center p-3"
                    >
                        <img
                            src={game.image || "/static/default-game.png"}
                            alt={game.name}
                            className="w-32 h-32 object-cover rounded mb-2"
                        />
                        <div className="text-white text-center font-semibold">{game.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Recommendations() {
    const [games, setGames] = useState([]);
    useEffect(() => {
        fetch("/api/games/")
            .then(res => res.json())
            .then(setGames);
    }, []);

    return (
        <div>
            <h2 className="text-white text-2xl font-bold mt-6 mb-4">Recommendations</h2>
            <div className="flex overflow-x-auto space-x-6 pb-2 hide-scrollbar">
                {games.slice(0, 10).map((game, idx) => (
                    <div
                        key={game.id || idx}
                        className="min-w-[160px] max-w-[160px] bg-neutral-800 rounded-lg shadow-md flex flex-col items-center p-3"
                    >
                        <img
                            src={game.image || "/static/default-game.png"}
                            alt={game.name}
                            className="w-32 h-32 object-cover rounded mb-2"
                        />
                        <div className="text-white text-center font-semibold">{game.name}</div>
                    </div>
                ))}
            </div>
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
        fetch("/api/users/me/", {
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
                    src="/static/XPLogo.png"
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
                        src="/static/PlaceholderProfile.png"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </button>
                {profileDropdownOpen && (
                    <div
                        ref={profileMenuRef}
                        className="absolute right-0 top-20 mt-2 w-1/4 h-5/6 bg-neutral-900 bg-opacity-80 rounded-lg shadow-lg z-50"
                    >
                        <div className="flex flex-col items-center p-4">
                            <img
                                src="/static/PlaceholderProfile.png"
                                alt="Profile"
                                className="w-40 h-40 rounded-full border-4 border-white object-fill mb-2"
                            />
                            <div className="text-white font-semibold mb-1 text-4xl">
                                {user ? user.name : "Name"}
                            </div>
                            <div className="text-neutral-400 text-sm mb-10">
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
                            {user && (user.role === "Teacher" || user.role === "Admin") && (
                                <button
                                    className="w-full bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded mb-2"
                                    onClick={() => {
                                        setProfileDropdownOpen(false);
                                        navigate("/Edit");
                                    }}
                                >
                                    Admin
                                </button>
                            )}
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
            <div className="flex-1 p-8 overflow-y-auto hide-scrollbar">{renderContent()}</div>
        </div>
    );
}

export default Dashboard;