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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-serif text-[#0b2b24] uppercase tracking-tighter">System Overview</h1>
        <p className="text-[#0b2b24]/40 mt-2 font-black text-[10px] uppercase tracking-[0.3em]">Welcome to the NexaLearn Command Center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-[2rem] p-8 shadow-xl border border-[#0b2b24]/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fdf7e9] border border-[#d1e8c4] flex items-center justify-center text-[#0b2b24] mb-6">
                <Icon size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#0b2b24]/40 uppercase tracking-widest mb-1">{stat.title}</p>
                <h3 className="text-4xl font-serif text-[#0b2b24]">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-[#0b2b24] rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <h3 className="text-3xl font-serif mb-6 uppercase tracking-widest text-[#d1e8c4]">Management Status</h3>
        <p className="text-white/60 text-lg font-light leading-relaxed max-w-2xl">
          The NexaLearn administrative ecosystem is synchronized. All student data and syllabus modules are under active management. Use the premium sidebar for deep configuration.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
