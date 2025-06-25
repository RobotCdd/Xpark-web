import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Edit() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
    fetch("http://127.0.0.1:8000/users/", {
        cache: "no-store"
    })
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error("Failed to fetch users:", err));
}, []);

    const handleEdit = (id) => {
        navigate(`/Action/${id}`);
    };

    const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/users/${id}/`, {
        method: "DELETE",
    })
    .then(res => {
        if (res.ok) {
            setUsers(users.filter((user) => user.id !== id));
        } else {
            alert("Failed to delete user.");
        }
    })
    .catch(() => alert("Failed to delete user."));
};

    return (
        <div className="p-8 bg-black h-screen">
            <div className="flex mb-6">
          <button onClick={() => navigate("/")} className="text-white hover:underline">
            ← Go back
          </button>
        </div>
        <div className="max-h-dvh overflow-y-auto rounded-lg border-2 border-neutral-700 shadow items-center">
            <table className="min-w-full divide-y-2 divide-x-2 divide-neutral-700">
            <thead className="bg-transparent sticky top-0">
                <tr>
                <th className="px-6 py-3 text-left text-lg font-bold text-white uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-lg font-bold text-white uppercase tracking-wider">Email</th>
                <th className="px-6 py-3"></th>
                <th className="px-6 py-3"></th>
                </tr>
            </thead>
            <tbody className="bg-transparent divide-y-2 divide-x-2 divide-neutral-700 text-gray-400">
                {users.map((user, idx) => (
                <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <button
                        onClick={() => handleEdit(user.id)}
                        className="text-blue-600 hover:underline"
                    >
                        Edit
                    </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline"
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))}
                {users.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                    No users found.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        <button onClick={() => navigate("/AddUser")} className="text-white hover:underline mt-4">
                Add User
        </button>
        </div>
    );
}

export default Edit;