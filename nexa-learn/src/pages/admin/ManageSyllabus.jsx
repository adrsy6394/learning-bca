import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Trash2, Plus, Edit2, ChevronDown, ChevronUp } from "lucide-react";

const ManageSyllabus = () => {
  const { user } = useAuth();
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedModule, setExpandedModule] = useState(null);

  const API_URL = import.meta.env.VITE_MAIN_URL || "http://localhost:5000";

  const fetchSyllabus = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v2/syllabus`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (data.success) {
        setSyllabus(data.data);
      }
    } catch (err) {
      setError("Failed to fetch syllabus.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, [user.token, API_URL]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete syllabus module "${title}"?`)) {
      try {
        await axios.delete(`${API_URL}/api/v2/admin/syllabus/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSyllabus(syllabus.filter((s) => s._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete syllabus");
      }
    }
  };

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Syllabus Manager</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage semesters, subjects, and topics.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/30">
          <Plus size={20} />
          Add Module
        </button>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>}

      <div className="space-y-4">
        {syllabus.map((module) => (
          <div key={module._id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all">
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
              onClick={() => setExpandedModule(expandedModule === module._id ? null : module._id)}
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{module.semester}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{module.subject} ({module.units?.length || 0} units)</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(module._id, `${module.semester} - ${module.subject}`)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  {expandedModule === module._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {expandedModule === module._id && (
              <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-4 mt-6">
                  {module.units?.map((unit, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{unit.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {unit.topics?.map((topic, i) => (
                          <span key={i} className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400 shadow-sm">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {(!module.units || module.units.length === 0) && (
                    <p className="text-slate-500 italic">No units defined for this module.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSyllabus;
