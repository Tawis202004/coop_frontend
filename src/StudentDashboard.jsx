import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, XCircle, Clock, FileText, Search, 
  Users, Calendar, Plus, RefreshCw, ShieldAlert, AlertCircle, Edit, Trash2
} from 'lucide-react';

const API_BASE = 'https://coop-backend-02.vercel.app';

// Helper สำหรับส่ง Header Bearer Token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// ==========================================
// 1. CoordinatorManagement Component (ผู้ประสานงาน)
// ==========================================
export const CoordinatorManagement = ({ activeTab }) => {
  // --- States สำหรับ "อนุมัติคำร้อง" (manage_requests) ---
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // --- States สำหรับ "จัดการสิทธิ์นักศึกษา/ผู้ใช้งาน" (all_students) ---
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  // 1. API: ดึงรายการคำร้องขอปฏิบัติงานสหกิจศึกษาทั้งหมด
  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await axios.get(`${API_BASE}/applications`, getAuthHeaders());
      const data = Array.isArray(res.data) ? res.data : (res.data.applications || []);
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  // 2. API: ดึง รายชื่อนักศึกษา/ผู้ใช้งาน ทั้งหมดในระบบ
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const res = await axios.get(`${API_BASE}/students`, getAuthHeaders());
      const data = Array.isArray(res.data) ? res.data : (res.data.students || []);
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Trigger ดึงข้อมูลตาม Tab ที่เลือก
  useEffect(() => {
    if (activeTab === 'manage_requests') {
      fetchApplications();
    } else if (activeTab === 'all_students') {
      fetchStudents();
    }
  }, [activeTab]);

  // 3. API: อนุมัติคำร้อง
  const handleApproveApp = async (appId) => {
    try {
      setActionLoadingId(appId);
      await axios.put(`${API_BASE}/applications/${appId}/approve`, {}, getAuthHeaders());
      alert('อนุมัติคำร้องขอฝึกงานเรียบร้อยแล้ว');
      fetchApplications();
    } catch (err) {
      console.error("Approve error:", err);
      alert('เกิดข้อผิดพลาด ไม่สามารถอนุมัติคำร้องได้');
    } finally {
      setActionLoadingId(null);
    }
  };

  // 4. API: ปฏิเสธคำร้อง
  const handleRejectApp = async (appId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะปฏิเสธคำร้องนี้?')) return;
    try {
      setActionLoadingId(appId);
      await axios.put(`${API_BASE}/applications/${appId}/reject`, {}, getAuthHeaders());
      alert('ปฏิเสธคำร้องเรียบร้อยแล้ว');
      fetchApplications();
    } catch (err) {
      console.error("Reject error:", err);
      alert('เกิดข้อผิดพลาด ไม่สามารถปฏิเสธคำร้องได้');
    } finally {
      setActionLoadingId(null);
    }
  };

  // 5. API: อัปเดตสิทธิ์ผู้ใช้ (Role Management)
  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.put(`${API_BASE}/users/${userId}/role`, { role: newRole }, getAuthHeaders());
      alert(`อัปเดตสิทธิ์การใช้งานเป็น ${newRole} เรียบร้อยแล้ว`);
      fetchStudents();
    } catch (err) {
      console.error("Update role error:", err);
      alert('ไม่สามารถอัปเดตสิทธิ์ผู้ใช้ได้');
    }
  };

  // การกรองข้อมูลค้นหาคำร้อง
  const filteredApps = applications.filter(app => {
    const q = appSearch.toLowerCase();
    return (
      (app.student_name && app.student_name.toLowerCase().includes(q)) ||
      (app.company_name && app.company_name.toLowerCase().includes(q)) ||
      (app.student_id && app.student_id.toString().includes(q))
    );
  });

  // การกรองข้อมูลค้นหานักศึกษา
  const filteredStudents = students.filter(st => {
    const q = studentSearch.toLowerCase();
    return (
      (st.first_name && st.first_name.toLowerCase().includes(q)) ||
      (st.last_name && st.last_name.toLowerCase().includes(q)) ||
      (st.student_id && st.student_id.toString().includes(q))
    );
  });

  // ---------------- VIEW 1: จัดการอนุมัติคำร้อง ----------------
  if (activeTab === 'manage_requests') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-black text-gray-800 text-lg">รายการคำร้องขอสหกิจศึกษาทั้งหมด</h3>
            <p className="text-xs text-gray-400 font-bold mt-1">ตรวจสอบและดำเนินการอนุมัติหรือปฏิเสธคำร้องขอฝึกงานของนักศึกษา</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, รหัสนักศึกษา..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#800000]"
              />
            </div>
            <button 
              onClick={fetchApplications} 
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-600 transition-all active:scale-95"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw size={18} className={loadingApps ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {loadingApps ? (
          <div className="text-center py-16 bg-white rounded-[35px] border border-gray-100 text-gray-400 font-bold">
            กำลังดึงข้อมูลคำร้องจากเซิร์ฟเวอร์...
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white p-16 rounded-[35px] text-center text-gray-400 font-bold border border-gray-100">
            ไม่พบรายการคำร้องตรงตามเงื่อนไข
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredApps.map((app) => {
              const appId = app.id || app.application_id;
              return (
                <div key={appId} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-200 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-red-50 text-[#800000] px-2.5 py-0.5 rounded-md">
                        {app.student_id || 'N/A'}
                      </span>
                      <h4 className="font-black text-gray-800 text-base">{app.student_name || `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'ไม่ระบุชื่อ'}</h4>
                    </div>
                    <p className="text-xs font-bold text-gray-600">สถานประกอบการ: <span className="text-gray-900 font-black">{app.company_name || 'ไม่ระบุ'}</span></p>
                    <p className="text-[11px] text-gray-400 font-semibold">ตำแหน่ง: {app.position || '-'} | ยื่นคำร้องเมื่อ: {app.created_at ? new Date(app.created_at).toLocaleDateString('th-TH') : '-'}</p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                    <span className={`text-xs font-black px-3.5 py-1.5 rounded-xl ${
                      app.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      app.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {app.status === 'approved' ? 'อนุมัติแล้ว' : app.status === 'rejected' ? 'ปฏิเสธแล้ว' : 'รอการอนุมัติ'}
                    </span>

                    {app.status !== 'approved' && (
                      <button
                        onClick={() => handleApproveApp(appId)}
                        disabled={actionLoadingId === appId}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 size={16} /> อนุมัติ
                      </button>
                    )}

                    {app.status !== 'rejected' && (
                      <button
                        onClick={() => handleRejectApp(appId)}
                        disabled={actionLoadingId === appId}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 font-black text-xs rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle size={16} /> ปฏิเสธ
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ---------------- VIEW 2: จัดการนักศึกษา/สิทธิ์ใช้งาน ----------------
  if (activeTab === 'all_students') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-black text-gray-800 text-lg">จัดการรายชื่อสิทธิ์การใช้งานของนักศึกษา</h3>
            <p className="text-xs text-gray-400 font-bold mt-1">ดูรายชื่อนักศึกษาและปรับเปลี่ยนระดับสิทธิ์ (Role) ในระบบ</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหารหัสนักศึกษา, ชื่อ..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#800000]"
            />
          </div>
        </div>

        {loadingStudents ? (
          <div className="text-center py-16 bg-white rounded-[35px] border border-gray-100 text-gray-400 font-bold">
            กำลังโหลดข้อมูลนักศึกษา...
          </div>
        ) : (
          <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs font-bold text-gray-600">
              <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6">รหัสนักศึกษา</th>
                  <th className="py-4 px-6">ชื่อ-นามสกุล</th>
                  <th className="py-4 px-6">สาขาวิชา / คณะ</th>
                  <th className="py-4 px-6 text-center">ระดับสิทธิ์ (Role)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">ไม่พบรายชื่อนักศึกษา</td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => (
                    <tr key={st.id || st.student_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-black text-[#800000]">{st.student_id || '-'}</td>
                      <td className="py-4 px-6 text-gray-800 font-black">{st.first_name} {st.last_name}</td>
                      <td className="py-4 px-6 text-gray-500">{st.major || '-'} ({st.faculty || '-'})</td>
                      <td className="py-4 px-6 text-center">
                        <select
                          value={st.role || 'student'}
                          onChange={(e) => handleUpdateRole(st.user_id || st.id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 text-xs font-black text-gray-700 px-3 py-1.5 rounded-xl outline-none focus:border-[#800000] cursor-pointer"
                        >
                          <option value="student">นักศึกษา (Student)</option>
                          <option value="coordinator">ผู้ประสานงาน (Coordinator)</option>
                          <option value="advisor">อาจารย์นิเทศก์ (Advisor)</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return null;
};


// ==========================================
// 2. AdvisorManagement Component (อาจารย์นิเทศก์)
// ==========================================
export const AdvisorManagement = ({ activeTab }) => {
  // --- States สำหรับ "นักศึกษาในความดูแล" (my_students) ---
  const [myStudents, setMyStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // --- States สำหรับ "บันทึกการนิเทศงาน" (supervise) ---
  const [supervisions, setSupervisions] = useState([]);
  const [loadingSupervisions, setLoadingSupervisions] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form State สร้างการนิเทศ
  const [formData, setFormData] = useState({
    student_id: '',
    notes: '',
    supervision_date: new Date().toISOString().split('T')[0],
    score: 100
  });

  // 1. API: ดึงรายการนักศึกษาในที่ปรึกษา/ความดูแล
  const fetchMyStudents = async () => {
    try {
      setLoadingStudents(true);
      const res = await axios.get(`${API_BASE}/teacher/students`, getAuthHeaders());
      const data = Array.isArray(res.data) ? res.data : (res.data.students || []);
      setMyStudents(data);
    } catch (err) {
      console.error("Error fetching teacher students:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  // 2. API: ดึงประวัติรายการการนิเทศงานทั้งหมดที่อาจารย์เคยบันทึก
  const fetchSupervisions = async () => {
    try {
      setLoadingSupervisions(true);
      const res = await axios.get(`${API_BASE}/teacher/supervisions`, getAuthHeaders());
      const data = Array.isArray(res.data) ? res.data : (res.data.supervisions || []);
      setSupervisions(data);
    } catch (err) {
      console.error("Error fetching supervisions:", err);
    } finally {
      setLoadingSupervisions(false);
    }
  };

  // Trigger ดึงข้อมูลเมื่อเปลี่ยน Tab
  useEffect(() => {
    if (activeTab === 'my_students') {
      fetchMyStudents();
    } else if (activeTab === 'supervise') {
      fetchMyStudents();
      fetchSupervisions();
    }
  }, [activeTab]);

  // 3. API: เพิ่มบันทึกการนิเทศงาน
  const handleCreateSupervision = async (e) => {
    e.preventDefault();
    if (!formData.student_id) {
      alert('กรุณาเลือกนักศึกษาที่ต้องการนิเทศงาน');
      return;
    }

    try {
      await axios.post(`${API_BASE}/supervision`, formData, getAuthHeaders());
      alert('บันทึกข้อมูลการนิเทศงานสำเร็จแล้ว');
      setShowModal(false);
      setFormData({
        student_id: '',
        notes: '',
        supervision_date: new Date().toISOString().split('T')[0],
        score: 100
      });
      fetchSupervisions();
    } catch (err) {
      console.error("Create supervision error:", err);
      alert('เกิดข้อผิดพลาด ไม่สามารถส่งข้อมูลการนิเทศได้');
    }
  };

  // ---------------- VIEW 1: บันทึกการนิเทศงาน ----------------
  if (activeTab === 'supervise') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-black text-gray-800 text-lg">ระบบบันทึกผลการนิเทศงาน</h3>
            <p className="text-xs text-gray-400 font-bold mt-1">บันทึกรายละเอียด ผลการประเมิน และข้อเสนอแนะในการนิเทศนักศึกษา</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-[#800000] hover:bg-black text-white rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus size={18} /> บันทึกการนิเทศใหม่
          </button>
        </div>

        {/* Modal ฟอร์มกรอกบันทึกการนิเทศ */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[35px] max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h4 className="font-black text-gray-800 text-base">สร้างบันทึกการนิเทศงาน</h4>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateSupervision} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">นักศึกษาในความดูแล *</label>
                  <select
                    required
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#800000]"
                  >
                    <option value="">-- เลือกนักศึกษา --</option>
                    {myStudents.map(st => (
                      <option key={st.id || st.student_id} value={st.student_id || st.id}>
                        {st.first_name} {st.last_name} ({st.student_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">วันที่เข้าตรวจนิเทศ *</label>
                  <input
                    type="date"
                    required
                    value={formData.supervision_date}
                    onChange={(e) => setFormData({ ...formData, supervision_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#800000]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">คะแนนการประเมิน (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#800000]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">บันทึกเพิ่มเติม / ผลการนิเทศ *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="ระบุข้อเสนอแนะ ผลการปฏิบัติงาน หรือรายงานจากสถานประกอบการ..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-[#800000]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-xs"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#800000] hover:bg-black text-white rounded-xl font-black text-xs shadow-md"
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* แสดงรายการประวัติการนิเทศงาน */}
        {loadingSupervisions ? (
          <div className="text-center py-16 bg-white rounded-[35px] border border-gray-100 text-gray-400 font-bold">
            กำลังโหลดประวัติการนิเทศงาน...
          </div>
        ) : supervisions.length === 0 ? (
          <div className="bg-white p-16 rounded-[35px] text-center text-gray-400 font-bold border border-gray-100">
            ยังไม่มีประวัติการบันทึกการนิเทศงานในระบบ
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {supervisions.map((sup) => (
              <div key={sup.id || sup.supervision_id} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-black text-gray-800 text-base">{sup.student_name || `รหัสนักศึกษา: ${sup.student_id}`}</h5>
                    <p className="text-xs font-bold text-gray-400 mt-0.5">วันที่นิเทศ: {sup.supervision_date ? new Date(sup.supervision_date).toLocaleDateString('th-TH') : '-'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sup.score !== undefined && (
                      <span className="text-xs font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-xl">
                        คะแนน: {sup.score}/100
                      </span>
                    )}
                    <span className="text-xs font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl">
                      บันทึกแล้ว
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs font-semibold text-gray-700 whitespace-pre-line">{sup.notes || 'ไม่มีรายละเอียดบันทึก'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---------------- VIEW 2: นักศึกษาในความดูแล ----------------
  if (activeTab === 'my_students') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 text-lg">รายชื่อนักศึกษาในความดูแล</h3>
          <p className="text-xs text-gray-400 font-bold mt-1">รายการนักศึกษาที่คุณได้รับมอบหมายให้เป็นอาจารย์นิเทศก์</p>
        </div>

        {loadingStudents ? (
          <div className="text-center py-16 bg-white rounded-[35px] border border-gray-100 text-gray-400 font-bold">
            กำลังโหลดรายชื่อนักศึกษา...
          </div>
        ) : myStudents.length === 0 ? (
          <div className="bg-white p-16 rounded-[35px] text-center text-gray-400 font-bold border border-gray-100">
            ขณะนี้ยังไม่มีนักศึกษาในความดูแลของคุณ
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myStudents.map((st) => (
              <div key={st.id || st.student_id} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm space-y-4 hover:border-gray-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-50 text-[#800000] font-black rounded-2xl flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800">{st.first_name} {st.last_name}</h4>
                    <p className="text-xs font-bold text-gray-400">รหัสนักศึกษา: {st.student_id || '-'}</p>
                  </div>
                </div>

                <div className="text-xs font-bold text-gray-500 border-t border-gray-100 pt-3 space-y-1.5">
                  <p className="flex justify-between">
                    <span>สาขาวิชา:</span>
                    <span className="text-gray-800 font-black">{st.major || '-'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>สถานประกอบการ:</span>
                    <span className="text-[#800000] font-black">{st.company_name || 'ยังไม่ระบุ'}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};