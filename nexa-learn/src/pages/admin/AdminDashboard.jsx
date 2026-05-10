import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Users, BookOpen, Layers, UserCog } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_MAIN_URL || "http://localhost:5000";
  const [syncing, setSyncing] = useState(false);

  const handleSyncKnowledge = async () => {
    if (!window.confirm("This will process all syllabus data into vectors for the AI Bot. Continue?")) return;
    
    setSyncing(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/v2/admin/sync-knowledge`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (data.success) {
        alert(data.message || "Knowledge base synced successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to sync knowledge base. Check if OPENAI_API_KEY is set in backend .env");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/v2/admin/stats`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        setError("Failed to load dashboard statistics.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.token, API_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      bgLight: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Admin Users",
      value: stats?.totalAdmins || 0,
      icon: UserCog,
      color: "bg-purple-500",
      bgLight: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Syllabus Modules",
      value: stats?.totalSyllabusModules || 0,
      icon: BookOpen,
      color: "bg-green-500",
      bgLight: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Total Topics",
      value: stats?.totalTopics || 0,
      icon: Layers,
      color: "bg-amber-500",
      bgLight: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome to the NexaLearn Admin Dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center"
            >
              <div className={`p-4 rounded-xl ${stat.bgLight} mr-4`}>
                <Icon className={`w-8 h-8 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
         <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-2">AI Knowledge System</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Sync your syllabus and site data with the AI Bot's vector database (RAG). 
              This allows the bot to answer questions about specific subjects and topics.
            </p>
            <button
              onClick={handleSyncKnowledge}
              disabled={syncing}
              className={`flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50`}
            >
              <Layers className={`${syncing ? 'animate-spin' : ''}`} size={20} />
              {syncing ? "Syncing Knowledge..." : "Sync AI Knowledge Base"}
            </button>
         </div>
         
         <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-2">System Status</h3>
            <div className="flex items-center gap-2 text-green-500 font-medium">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               RAG Vector Index: Active
            </div>
            <p className="text-xs text-slate-400 mt-2 italic">Ensure your MongoDB Atlas Vector Index name is 'vector_index'</p>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
