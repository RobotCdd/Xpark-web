import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [pending, setPending] = useState({
        isSuspended: false,
        resetPassword: false,
        resetStatistics: false,
    });
    const [saved, setSaved] = useState({
        isSuspended: false,
        statistics: { gamesPlayed: 42, score: 1000 },
    });

    useEffect(() => {
        fetch("http://127.0.0.1:8000/users/")
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                const user = data.find((u) => u.id === Number(id));
                if (user) {
                    setPending((prev) => ({
                        ...prev,
                        isSuspended: user.is_suspended || false,
                    }));
                    setSaved((prev) => ({
                        ...prev,
                        isSuspended: user.is_suspended || false,
                    }));
                }
            })
            .catch(err => console.error("Failed to fetch users:", err));
    }, [id]);

    const user = users.find((u) => u.id === Number(id));

    const handleCheckbox = (field) => {
        setPending((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (pending.isSuspended !== saved.isSuspended) {
            await fetch(`http://127.0.0.1:8000/users/${id}/suspend/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_suspended: pending.isSuspended }),
            });
        }

        if (pending.resetPassword) {
            const newPassword = prompt("Enter new password for this user:");
            if (newPassword) {
                await fetch(`http://127.0.0.1:8000/users/${id}/reset-password/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password: newPassword }),
                });
                alert("Password reset!");
            }
        }

        // Reset statistics (dummy)
        let newStats = saved.statistics;
        if (pending.resetStatistics) {
            newStats = { gamesPlayed: 0, score: 0 };
            alert(`Statistics reset for user #${id} (dummy action)`);
        }

        setSaved({
            isSuspended: pending.isSuspended,
            statistics: newStats,
        });
        setPending((prev) => ({
            ...prev,
            resetPassword: false,
            resetStatistics: false,
        }));
    };

    return (
        <div className="p-8 bg-black h-screen text-white flex justify-center items-center flex-col">
            <button onClick={() => window.location.href = "/edit"} className="mb-6 text-white hover:underline">
                ← Go back
            </button>
            <h1 className="text-3xl font-bold mb-6">User Settings #{id}</h1>
            <form onSubmit={handleSave} className="max-w-md space-y-6">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="suspend"
                        checked={pending.isSuspended}
                        onChange={() => handleCheckbox("isSuspended")}
                        className="w-5 h-5"
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
                        className="w-5 h-5"
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
                        className="w-5 h-5"
                    />
                    <label htmlFor="resetStatistics" className="text-lg select-none">
                        Reset Statistics
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-fuchsia-700 hover:bg-fuchsia-900 text-white px-4 py-2 rounded"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditUser;