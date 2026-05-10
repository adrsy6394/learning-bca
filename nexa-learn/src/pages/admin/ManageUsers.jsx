import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Trash2, UserCog, Shield, ShieldOff, Search } from "lucide-react";

const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = import.meta.env.VITE_MAIN_URL || "http://localhost:5000";

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v2/admin/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      setError("Failed to fetch users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user.token, API_URL]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user ${name}? This action cannot be undone.`)) {
      try {
        await axios.delete(`${API_URL}/api/v2/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    if (window.confirm(`Change role to ${newRole}?`)) {
      try {
        const { data } = await axios.put(
          `${API_URL}/api/v2/admin/users/${id}/role`,
          { role: newRole },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (data.success) {
          setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
        }
      } catch (err) {
         alert(err.response?.data?.message || "Failed to update role");
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all registered users.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Student ID</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                      {u.profileImage ? (
                         <img src={u.profileImage} alt={u.full_name} className="w-8 h-8 rounded-full" />
                      ) : (
                         <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                            {u.full_name?.charAt(0).toUpperCase()}
                         </div>
                      )}
                      {u.full_name}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{u.studentId}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        u.role === "admin" 
                          ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800" 
                          : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => toggleRole(u._id, u.role)}
                        disabled={user._id === u._id} // can't demote self
                        className={`p-2 rounded-lg transition-colors ${
                          user._id === u._id 
                            ? "opacity-50 cursor-not-allowed text-slate-400" 
                            : "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                        }`}
                        title={u.role === "admin" ? "Demote to Student" : "Promote to Admin"}
                      >
                        {u.role === "admin" ? <ShieldOff size={18} /> : <Shield size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id, u.full_name)}
                        disabled={u.role === "admin" && user._id !== u._id} // restrict deleting other admins
                        className={`p-2 rounded-lg transition-colors ${
                          (u.role === "admin" && user._id !== u._id)
                            ? "opacity-50 cursor-not-allowed text-slate-400"
                            : "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                        }`}
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
