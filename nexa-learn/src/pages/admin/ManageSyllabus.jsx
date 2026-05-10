import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Trash2, Plus, Edit2, ChevronDown, ChevronUp, X, Save } from "lucide-react";

const ManageSyllabus = () => {
  const { user } = useAuth();
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedModule, setExpandedModule] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    semester: "",
    subjectName: "",
    units: [{ unitName: "", topics: "" }],
  });
  const [formLoading, setFormLoading] = useState(false);

  const API_URL = import.meta.env.VITE_MAIN_URL || "http://localhost:5000";

  const fetchSyllabus = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v2/admin/syllabus`, {
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

  // --- Modal & Form Handlers ---

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ semester: "", subjectName: "", units: [{ unitName: "", topics: "" }] });
    setIsModalOpen(true);
  };

  const openEditModal = (module) => {
    setEditingId(module._id);
    const formattedUnits = module.units.map(unit => ({
      unitName: unit.unitName || unit.title || "",
      topics: unit.topics.join(", ")
    }));
    setFormData({
      semester: module.semester || "",
      subjectName: module.subjectName || module.subject || "",
      units: formattedUnits.length > 0 ? formattedUnits : [{ unitName: "", topics: "" }]
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddUnit = () => {
    setFormData({
      ...formData,
      units: [...formData.units, { unitName: "", topics: "" }]
    });
  };

  const handleRemoveUnit = (index) => {
    const newUnits = [...formData.units];
    newUnits.splice(index, 1);
    setFormData({ ...formData, units: newUnits });
  };

  const handleUnitChange = (index, field, value) => {
    const newUnits = [...formData.units];
    newUnits[index][field] = value;
    setFormData({ ...formData, units: newUnits });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payloadUnits = formData.units.map(unit => ({
        unitName: unit.unitName,
        topics: unit.topics.split(",").map(t => t.trim()).filter(t => t)
      }));

      const payload = {
        semester: Number(formData.semester),
        subjectName: formData.subjectName,
        units: payloadUnits
      };

      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      if (editingId) {
        const { data } = await axios.put(`${API_URL}/api/v2/admin/syllabus/${editingId}`, payload, config);
        setSyllabus(syllabus.map(s => s._id === editingId ? data.syllabus : s));
      } else {
        const { data } = await axios.post(`${API_URL}/api/v2/admin/syllabus`, payload, config);
        setSyllabus([...syllabus, data.syllabus]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save syllabus module");
    } finally {
      setFormLoading(false);
    }
  };

  const groupedSyllabus = syllabus.reduce((acc, module) => {
    const sem = module.semester;
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(module);
    return acc;
  }, {});

  const sortedSemesters = Object.keys(groupedSyllabus).sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Syllabus Manager</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organize courses by semester and manage subjects.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/30"
        >
          <Plus size={20} />
          Add New Subject
        </button>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>}

      <div className="space-y-10">
        {sortedSemesters.map((sem) => (
          <div key={sem} className="space-y-4">
            <div className="flex items-center gap-4 px-2">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Semester {sem}
                </h2>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ semester: sem, subjectName: "", units: [{ unitName: "", topics: "" }] });
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-all"
                  title={`Add subject to Semester ${sem}`}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {groupedSyllabus[sem].map((module) => (
                <div key={module._id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    onClick={() => setExpandedModule(expandedModule === module._id ? null : module._id)}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{module.subjectName}</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{module.units?.length || 0} Units in this subject</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => openEditModal(module)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(module._id, `Semester ${module.semester} - ${module.subjectName}`)}
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
                    <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-4 mt-6">
                        {module.units?.map((unit, index) => (
                          <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{unit.unitName}</h4>
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
                          <p className="text-slate-500 italic">No units defined for this subject.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {syllabus.length === 0 && !loading && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">No syllabus modules found. Click "Add Module" to create one.</p>
          </div>
        )}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Module" : "Add New Module"}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="syllabus-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Semester</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 1"
                      value={formData.semester}
                      onChange={(e) => setFormData({...formData, semester: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mathematics"
                      value={formData.subjectName}
                      onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Units</label>
                    <button 
                      type="button" 
                      onClick={handleAddUnit}
                      className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Plus size={16} /> Add Unit
                    </button>
                  </div>
                  
                  {formData.units.map((unit, index) => (
                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl relative group">
                      <button 
                        type="button"
                        onClick={() => handleRemoveUnit(index)}
                        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Unit"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="space-y-4 pr-8">
                        <div>
                          <input 
                            type="text" 
                            required
                            placeholder={`Unit ${index + 1} Title`}
                            value={unit.unitName}
                            onChange={(e) => handleUnitChange(index, "unitName", e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white"
                          />
                        </div>
                        <div>
                          <textarea 
                            required
                            placeholder="Comma separated topics (e.g. Algebra, Calculus, Geometry)"
                            rows="2"
                            value={unit.topics}
                            onChange={(e) => handleUnitChange(index, "topics", e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white resize-none"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.units.length === 0 && (
                    <p className="text-sm text-slate-500 italic">No units added. Add at least one unit.</p>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-end gap-3">
              <button 
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="syllabus-form"
                disabled={formLoading || formData.units.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-500/30"
              >
                {formLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save size={18} />
                )}
                {editingId ? "Save Changes" : "Create Module"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSyllabus;
