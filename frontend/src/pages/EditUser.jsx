import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Dummy users list for demonstration
    const [users, setUsers] = useState([
        { id: 1, email: "user1@example.com" },
        { id: 2, email: "user2@example.com" },
        { id: 3, email: "user3@example.com" },
        { id: 4, email: "user4@example.com" },
        { id: 5, email: "user5@example.com" },
        { id: 6, email: "user6@example.com" },
        { id: 7, email: "user7@example.com" },
        { id: 8, email: "user8@example.com" },
        { id: 9, email: "user9@example.com" },
        { id: 10, email: "user10@example.com" },
    ]);

    const user = users.find((u) => u.id === Number(id));

    // Local state for checkboxes (pending changes)
    const [pending, setPending] = useState({
        isSuspended: false,
        resetPassword: false,
        resetStatistics: false,
    });

    // Saved state
    const [saved, setSaved] = useState({
        isSuspended: false,
        statistics: { gamesPlayed: 42, score: 1000 },
    });

    // Add a new user
    const handleAddUser = () => {
        const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const newEmail = `user${newId}@example.com`;
        setUsers([...users, { id: newId, email: newEmail }]);
        alert(`Added user: ${newEmail}`);
    };

    // Drop (delete) user
    const handleDropUser = () => {
        setUsers(users.filter((u) => u.id !== Number(id)));
        alert(`User #${id} dropped`);
        navigate("/edit");
    };

    // Handle checkbox changes
    const handleCheckbox = (field) => {
        setPending((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Save changes
    const handleSave = (e) => {
        e.preventDefault();
        let newStats = saved.statistics;
        if (pending.resetStatistics) {
            newStats = { gamesPlayed: 0, score: 0 };
            alert(`Statistics reset for user #${id} (dummy action)`);
        }
        if (pending.resetPassword) {
            alert(`Password reset for user #${id} (dummy action)`);
        }
        if (pending.isSuspended !== saved.isSuspended) {
            alert(`User #${id} ${pending.isSuspended ? "suspended" : "unsuspended"} (dummy action)`);
        }
        setSaved({
            isSuspended: pending.isSuspended,
            statistics: newStats,
        });
        // Reset one-time actions
        setPending((prev) => ({
            ...prev,
            resetPassword: false,
            resetStatistics: false,
        }));
    };

    return (
        <div className="p-8 bg-black h-screen text-white flex justify-center items-center flex-col">
            <button onClick={() => navigate("/edit")} className="mb-6 text-white hover:underline">
                ← Go back
            </button>
            <h1 className="text-2xl font-bold mb-6">User Settings #{id}</h1>
            <form onSubmit={handleSave} className="max-w-md space-y-6">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="suspend"
                        checked={pending.isSuspended}
                        onChange={() => handleCheckbox("isSuspended")}
                        className="w-5 h-5 accent-orange-600"
                    />
                    <label htmlFor="suspend" className="text-lg select-none">
                        Suspend User
                    </label>
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="resetPassword"
                        checked={pending.resetPassword}
                        onChange={() => handleCheckbox("resetPassword")}
                        className="w-5 h-5 accent-yellow-600"
                    />
                    <label htmlFor="resetPassword" className="text-lg select-none">
                        Reset Password
                    </label>
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="resetStatistics"
                        checked={pending.resetStatistics}
                        onChange={() => handleCheckbox("resetStatistics")}
                        className="w-5 h-5 accent-purple-600"
                    />
                    <label htmlFor="resetStatistics" className="text-lg select-none">
                        Reset Statistics
                    </label>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={handleAddUser}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Add New User
                    </button>
                    <button
                        type="button"
                        onClick={handleDropUser}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Drop User
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditUser;