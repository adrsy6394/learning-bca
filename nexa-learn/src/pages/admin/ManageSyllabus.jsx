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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-[#0b2b24] uppercase tracking-tighter">Syllabus Engine</h1>
          <p className="text-[#0b2b24]/40 mt-2 font-black text-[10px] uppercase tracking-[0.3em]">Curriculum architecture and management</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-3 px-10 py-5 bg-[#0b2b24] text-[#d1e8c4] rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          <Plus size={18} />
          Architect New Subject
        </button>
      </div>

      {error && <div className="p-6 bg-red-50 text-red-700 rounded-[2rem] border border-red-100 font-bold text-xs uppercase tracking-widest">{error}</div>}

      <div className="space-y-16">
        {sortedSemesters.map((sem) => (
          <div key={sem} className="space-y-6">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-serif text-[#0b2b24] uppercase tracking-[0.2em] whitespace-nowrap">
                Semester {sem}
              </h2>
              <div className="h-px flex-1 bg-[#0b2b24]/10"></div>
              <button 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ semester: sem, subjectName: "", units: [{ unitName: "", topics: "" }] });
                  setIsModalOpen(true);
                }}
                className="w-10 h-10 bg-[#0b2b24] text-[#d1e8c4] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                title={`Add subject to Semester ${sem}`}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {groupedSyllabus[sem].map((module) => (
                <div key={module._id} className="bg-white rounded-[2.5rem] shadow-xl border border-[#0b2b24]/5 overflow-hidden transition-all duration-500">
                  <div 
                    className={`flex items-center justify-between p-8 cursor-pointer transition-colors ${expandedModule === module._id ? "bg-[#fdf7e9]/50" : "hover:bg-[#fdf7e9]/30"}`}
                    onClick={() => setExpandedModule(expandedModule === module._id ? null : module._id)}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-[#0b2b24]">{module.subjectName}</h3>
                      <p className="text-[10px] font-black text-[#0b2b24]/30 uppercase tracking-[0.2em] mt-2">{module.units?.length || 0} Modules Integrated</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => openEditModal(module)}
                          className="p-3 bg-[#fdf7e9] text-[#0b2b24] hover:bg-[#0b2b24] hover:text-white rounded-xl transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(module._id, `Semester ${module.semester} - ${module.subjectName}`)}
                          className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${expandedModule === module._id ? "bg-[#0b2b24] text-[#d1e8c4] rotate-180" : "bg-[#fdf7e9] text-[#0b2b24]"}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  {expandedModule === module._id && (
                    <div className="p-8 pt-0 animate-in slide-in-from-top-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {module.units?.map((unit, index) => (
                          <div key={index} className="p-8 bg-[#fdf7e9] rounded-[2rem] border border-[#0b2b24]/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#0b2b24]/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <h4 className="font-bold text-[#0b2b24] mb-4 text-lg">{unit.unitName}</h4>
                            <div className="flex flex-wrap gap-2">
                              {unit.topics?.map((topic, i) => (
                                <span key={i} className="px-4 py-1.5 bg-white text-[#0b2b24] text-[10px] font-black rounded-full border border-[#0b2b24]/5 uppercase tracking-widest shadow-sm">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {syllabus.length === 0 && !loading && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-[#0b2b24]/20">
            <p className="text-[10px] font-black text-[#0b2b24]/20 uppercase tracking-[0.3em]">No curriculum data detected. Architect a new subject to begin.</p>
          </div>
        )}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0b2b24]/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-[#fdf7e9] rounded-[3rem] shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-10 border-b border-[#0b2b24]/5 bg-white/50">
              <h2 className="text-3xl font-serif text-[#0b2b24] uppercase tracking-tighter">
                {editingId ? "Modify Architecture" : "New Curriculum"}
              </h2>
              <button 
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-[#0b2b24]/30 hover:text-red-500 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-10 overflow-y-auto flex-1 custom-scrollbar">
              <form id="syllabus-form" onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#0b2b24]/40 uppercase tracking-widest ml-4">Target Semester</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 1"
                      value={formData.semester}
                      onChange={(e) => setFormData({...formData, semester: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-[#0b2b24]/5 rounded-full focus:ring-2 focus:ring-[#d1e8c4] outline-none text-[#0b2b24] font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#0b2b24]/40 uppercase tracking-widest ml-4">Subject Identity</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mathematics"
                      value={formData.subjectName}
                      onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-[#0b2b24]/5 rounded-full focus:ring-2 focus:ring-[#d1e8c4] outline-none text-[#0b2b24] font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <label className="text-[10px] font-black text-[#0b2b24] uppercase tracking-widest">Learning Modules</label>
                    <button 
                      type="button" 
                      onClick={handleAddUnit}
                      className="text-[10px] font-black text-[#0b2b24]/60 hover:text-[#0b2b24] flex items-center gap-2 uppercase tracking-widest"
                    >
                      <Plus size={16} /> Add Module
                    </button>
                  </div>
                  
                  {formData.units.map((unit, index) => (
                    <div key={index} className="p-8 bg-white border border-[#0b2b24]/5 rounded-[2rem] relative group shadow-sm">
                      <button 
                        type="button"
                        onClick={() => handleRemoveUnit(index)}
                        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        title="Remove Module"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="space-y-6">
                        <div>
                          <input 
                            type="text" 
                            required
                            placeholder={`Module ${index + 1} Title`}
                            value={unit.unitName}
                            onChange={(e) => handleUnitChange(index, "unitName", e.target.value)}
                            className="w-full px-6 py-3 bg-[#fdf7e9]/50 border border-[#0b2b24]/5 rounded-full focus:ring-2 focus:ring-[#d1e8c4] outline-none text-sm font-bold text-[#0b2b24]"
                          />
                        </div>
                        <div>
                          <textarea 
                            required
                            placeholder="Comma separated topics (Algebra, Calculus, ...)"
                            rows="2"
                            value={unit.topics}
                            onChange={(e) => handleUnitChange(index, "topics", e.target.value)}
                            className="w-full px-6 py-4 bg-[#fdf7e9]/50 border border-[#0b2b24]/5 rounded-[1.5rem] focus:ring-2 focus:ring-[#d1e8c4] outline-none text-sm font-medium text-[#0b2b24] resize-none"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-10 border-t border-[#0b2b24]/5 bg-white/30 flex justify-end gap-4">
              <button 
                type="button"
                onClick={closeModal}
                className="px-8 py-4 bg-white text-[#0b2b24]/40 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/80 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="syllabus-form"
                disabled={formLoading || formData.units.length === 0}
                className="flex items-center gap-3 px-10 py-4 bg-[#0b2b24] text-[#d1e8c4] rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50"
              >
                {formLoading ? (
                  <div className="w-5 h-5 border-2 border-[#d1e8c4]/30 border-t-[#d1e8c4] rounded-full animate-spin"></div>
                ) : (
                  <Save size={18} />
                )}
                {editingId ? "Deploy Changes" : "Deploy Module"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSyllabus;
