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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ full_name: "", email: "", password: "" });
  const [formLoading, setFormLoading] = useState(false);

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

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/api/v2/admin/users/add-admin`,
        newAdmin,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (data.success) {
        alert("New Admin added successfully!");
        setUsers([...users, data.data]);
        setIsModalOpen(false);
        setNewAdmin({ full_name: "", email: "", password: "" });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add admin");
    } finally {
      setFormLoading(false);
    }
  };

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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-[#0b2b24] uppercase tracking-tighter">User Database</h1>
          <p className="text-[#0b2b24]/40 mt-2 font-black text-[10px] uppercase tracking-[0.3em]">Access control and identity management</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0b2b24]/20 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 w-full sm:w-64 rounded-full bg-white border border-[#0b2b24]/5 text-[#0b2b24] text-xs font-bold focus:ring-2 focus:ring-[#d1e8c4] outline-none transition-all placeholder-[#0b2b24]/20 shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#0b2b24] text-[#d1e8c4] rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <UserCog size={16} />
            Create Admin
          </button>
        </div>
      </div>

      {error && <div className="p-6 bg-red-50 text-red-700 rounded-[2rem] border border-red-100 font-bold text-xs uppercase tracking-widest">{error}</div>}

      <div className="bg-white rounded-[3rem] shadow-2xl border border-[#0b2b24]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdf7e9]/50 border-b border-[#0b2b24]/5 text-[#0b2b24]/40 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="p-8">Identity</th>
                <th className="p-8">Contact</th>
                <th className="p-8">Status</th>
                <th className="p-8 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0b2b24]/5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-[#fdf7e9]/30 transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        {u.profileImage ? (
                           <img src={u.profileImage} alt={u.full_name} className="w-12 h-12 rounded-2xl object-cover border-2 border-[#fdf7e9]" />
                        ) : (
                           <div className="w-12 h-12 rounded-2xl bg-[#fdf7e9] border border-[#d1e8c4] flex items-center justify-center text-[#0b2b24] font-serif text-xl">
                              {u.full_name?.charAt(0).toUpperCase()}
                           </div>
                        )}
                        <div>
                          <p className="font-bold text-[#0b2b24]">{u.full_name}</p>
                          <p className="text-[10px] font-black text-[#0b2b24]/30 uppercase tracking-widest">{u.studentId || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <p className="text-sm font-medium text-[#0b2b24]/60">{u.email}</p>
                    </td>
                    <td className="p-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                        u.role === "admin" 
                          ? "bg-[#0b2b24] text-[#d1e8c4] border-[#0b2b24]" 
                          : "bg-[#d1e8c4] text-[#0b2b24] border-[#d1e8c4]"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => toggleRole(u._id, u.role)}
                          disabled={user._id === u._id}
                          className={`p-3 rounded-xl transition-all ${
                            user._id === u._id 
                              ? "opacity-20 cursor-not-allowed" 
                              : "bg-[#fdf7e9] text-[#0b2b24] hover:bg-[#0b2b24] hover:text-white"
                          }`}
                          title={u.role === "admin" ? "Revoke Admin Rights" : "Grant Admin Rights"}
                        >
                          {u.role === "admin" ? <ShieldOff size={16} /> : <Shield size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id, u.full_name)}
                          disabled={u.role === "admin" && user._id !== u._id}
                          className={`p-3 rounded-xl transition-all ${
                            (u.role === "admin" && user._id !== u._id)
                              ? "opacity-20 cursor-not-allowed"
                              : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                          }`}
                          title="Delete Identity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <p className="text-[10px] font-black text-[#0b2b24]/20 uppercase tracking-[0.3em]">No identities found matching your query</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0b2b24]/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-[#fdf7e9] w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-[#0b2b24]/5 flex justify-between items-center bg-white/50">
              <h2 className="text-2xl font-serif text-[#0b2b24] uppercase tracking-tighter">New Administrator</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-[#0b2b24]/30 hover:text-red-500 transition-all shadow-sm"
              >
                 <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddAdmin} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0b2b24]/40 uppercase tracking-widest ml-4">Full Identity Name</label>
                <input
                  type="text"
                  required
                  value={newAdmin.full_name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                  className="w-full px-6 py-4 bg-white border border-[#0b2b24]/5 rounded-full focus:ring-2 focus:ring-[#d1e8c4] outline-none text-[#0b2b24] font-bold transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0b2b24]/40 uppercase tracking-widest ml-4">Secured Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full px-6 py-4 bg-white border border-[#0b2b24]/5 rounded-full focus:ring-2 focus:ring-[#d1e8c4] outline-none text-[#0b2b24] font-bold transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#0b2b24]/40 uppercase tracking-widest ml-4">Access Password</label>
                <input
                  type="password"
                  required
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="w-full px-6 py-4 bg-white border border-[#0b2b24]/5 rounded-full focus:ring-2 focus:ring-[#d1e8c4] outline-none text-[#0b2b24] font-bold transition-all"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-white text-[#0b2b24]/40 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/80 transition-all shadow-sm"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-6 py-4 bg-[#0b2b24] text-[#d1e8c4] rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                >
                  {formLoading ? "Authorizing..." : "Create Identity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
