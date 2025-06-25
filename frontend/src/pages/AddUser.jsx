import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [city, setCity] = useState('Unknown');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: username,
            password: password,
            email: email,
            city: city,
            role: role,
            phone: phone,
        }),
        })
        .then(res => {
            if (res.ok) {
            navigate("/");
            }
        })
        .catch(() => alert("Registration failed."));
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

    };

    return (
        <div className="p-8 bg-black h-screen text-white flex justify-center items-center flex-col">
            <button onClick={() => window.location.href = "/edit"} className="mb-6 text-white hover:underline">
                ← Go back
            </button>
            <h1 className="text-3xl font-bold mb-6">User Settings #{id}</h1>
            <form onSubmit={handleSubmit} className="max-w-md space-y-6">
                <div>
                    <label className="block mb-1">Username</label>
                    <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                    required
                    />
                </div>
                <div>
                    <label className="block mb-1">Password</label>
                    <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                    required
                    />
                </div>
                <div>
                    <label className="block mb-1">Email</label>
                    <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                    required
                    />
                </div>
                <div>
                    <label className="block mb-1">Role</label>
                    <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                    >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1">City</label>
                    <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                    />
                </div>
                <div>
                    <label className="block mb-1">Phone</label>
                    <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-fuchsia-700 hover:bg-fuchsia-900 text-white px-4 py-2 rounded"
                >
                    Add User
                </button>
            </form>
        </div>
    );
}

export default AddUser;