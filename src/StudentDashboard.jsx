import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User,
  GraduationCap,
  Building,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  RefreshCw,
  Loader2,
  Filter,
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  UserCheck,
  Briefcase,
  Calendar,
  MessageSquare,
  LogOut,
  ChevronRight
} from 'lucide-react';

const API_BASE_URL = 'https://coop-backend-02.vercel.app';

// ==========================================
// 1. SUB-COMPONENT: Student Section (นักศึกษา)
// ==========================================
const StudentApplicationSection = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // State ฟอร์มยื่นคำร้อง
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    start_date: '',
    end_date: '',
    remarks: ''
  });

  const fetchStudentApplications = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setErrorMsg('ไม่สามารถดึงข้อมูลรายการคำร้องได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentApplications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');
      const token = localStorage.getItem('token');

      await axios.post(`${API_BASE_URL}/applications`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMsg('ยื่นคำร้องขอฝึกงาน/สหกิจศึกษาเรียบร้อยแล้ว');
      setFormData({
        company_name: '',
        position: '',
        start_date: '',
        end_date: '',
        remarks: ''
      });
      fetchStudentApplications();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'เกิดข้อผิดพลาดในการยื่นคำร้อง');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>ยื่นคำร้องฝึกงาน / สหกิจศึกษา</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ชื่อสถานประกอบการ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น บริษัท เทคโนโลยี จำกัด"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ตำแหน่งงาน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น Software Developer / Intern"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">วันที่เริ่มฝึกงาน</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">วันที่สิ้นสุดฝึกงาน</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">หมายเหตุ / รายละเอียดเพิ่มเติม</label>
            <textarea
              rows={2}
              placeholder="ระบุข้อความถึงอาจารย์ผู้ตรวจสอบ (ถ้ามี)"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs transition flex items-center justify-center space-x-1.5 shadow-xs disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>ส่งคำร้องขออนุมัติ</span>
          </button>
        </form>
      </div>

      {/* History List */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>ประวัติการยื่นคำร้องของฉัน</span>
          </h3>
          <button
            onClick={fetchStudentApplications}
            disabled={loading}
            className="text-slate-500 hover:text-slate-800 text-xs flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>รีเฟรช</span>
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
            <p className="text-xs mt-2">กำลังโหลดประวัติคำร้อง...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
            ยังไม่มีประวัติการยื่นคำร้อง
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const id = app.id || app._id;
              return (
                <div key={id} className="p-4 border border-slate-200 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">
                      {app.company_name || app.company?.name || 'สถานประกอบการ'}
                    </span>
                    <div>
                      {app.status === 'approved' || app.status === 'อนุมัติ' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>อนุมัติแล้ว</span>
                        </span>
                      ) : app.status === 'rejected' || app.status === 'ไม่อนุมัติ' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                          <XCircle className="w-3 h-3" />
                          <span>ไม่อนุมัติ</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" />
                          <span>รอพิจารณา</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-600">ตำแหน่ง: <strong>{app.position || '-'}</strong></p>

                  {app.teacher_comment && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs">
                      <strong>ความเห็นจากอาจารย์:</strong> {app.teacher_comment}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. SUB-COMPONENT: Teacher Section (อาจารย์)
// ==========================================
const TeacherApprovalSection = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [comments, setComments] = useState({});
  const [filterStatus, setFilterStatus] = useState('pending');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setErrorMsg('ไม่สามารถดึงข้อมูลรายการคำร้องได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      setErrorMsg('');
      setSuccessMsg('');
      const token = localStorage.getItem('token');

      await axios.put(
        `${API_BASE_URL}/applications/${appId}/status`,
        {
          status: newStatus,
          teacher_comment: comments[appId] || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg(`อัปเดตสถานะเป็น "${newStatus}" เรียบร้อยแล้ว`);
      setApplications((prev) =>
        prev.map((app) => {
          const id = app.id || app._id;
          if (id === appId) {
            return { ...app, status: newStatus, teacher_comment: comments[appId] || app.teacher_comment };
          }
          return app;
        })
      );
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    const st = (app.status || '').toLowerCase();
    if (filterStatus === 'pending') return st === 'pending' || st === 'รอการตรวจสอบ';
    if (filterStatus === 'approved') return st === 'approved' || st === 'อนุมัติ';
    if (filterStatus === 'rejected') return st === 'rejected' || st === 'ไม่อนุมัติ';
    return true;
  });

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <span>ตรวจอนุมัติคำร้องขอฝึกงาน (สำหรับอาจารย์)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">พิจารณาคำร้องและให้ข้อคิดเห็นแก่นักศึกษา</p>
        </div>
        <button
          onClick={fetchApplications}
          disabled={loading}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition flex items-center space-x-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>ดึงข้อมูลใหม่</span>
        </button>
      </div>

      {/* Control Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 text-xs font-medium">
        <Filter className="w-4 h-4 text-slate-400 mr-1" />
        {[
          { key: 'pending', label: 'รอพิจารณา' },
          { key: 'approved', label: 'อนุมัติแล้ว' },
          { key: 'rejected', label: 'ไม่อนุมัติ' },
          { key: 'all', label: 'ทั้งหมด' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterStatus === tab.key
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
          <p className="text-xs">กำลังโหลดคำร้อง...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-1 text-slate-500 text-xs">
          ไม่พบคำร้องในหมวดหมู่นี้
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const appId = app.id || app._id;
            const studentName = app.student_name || app.student?.fullname || app.student?.username || 'นักศึกษา';
            const companyName = app.company_name || app.company?.name || 'สถานประกอบการ';

            return (
              <div key={appId} className="p-4 border border-slate-200 rounded-xl space-y-3 text-xs bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <div className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span>{studentName}</span>
                    </div>
                    <div className="text-slate-500 mt-0.5">บริษัท: <strong className="text-slate-700">{companyName}</strong></div>
                  </div>
                  <div>
                    {app.status === 'approved' || app.status === 'อนุมัติ' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">อนุมัติแล้ว</span>
                    ) : app.status === 'rejected' || app.status === 'ไม่อนุมัติ' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">ไม่อนุมัติ</span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">รอพิจารณา</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div><strong>ตำแหน่ง:</strong> {app.position || '-'}</div>
                  <div><strong>ช่วงเวลา:</strong> {app.start_date || '-'} ถึง {app.end_date || '-'}</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="ความเห็นอาจารย์เพิ่มเติม (ถ้ามี)"
                    value={comments[appId] ?? (app.teacher_comment || '')}
                    onChange={(e) => setComments({ ...comments, [appId]: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      disabled={updatingId === appId}
                      onClick={() => handleUpdateStatus(appId, 'rejected')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium rounded-lg border border-rose-200 transition flex items-center space-x-1"
                    >
                      {updatingId === appId ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                      <span>ไม่อนุมัติ</span>
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === appId}
                      onClick={() => handleUpdateStatus(appId, 'approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition flex items-center space-x-1"
                    >
                      {updatingId === appId ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                      <span>อนุมัติคำร้อง</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. SUB-COMPONENT: Admin Section (ผู้ดูแลระบบ)
// ==========================================
const AdminUserManagementSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(err);
      setErrorMsg('ไม่สามารถดึงรายชื่อผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      setErrorMsg('');
      setSuccessMsg('');
      const token = localStorage.getItem('token');

      await axios.put(
        `${API_BASE_URL}/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg(`เปลี่ยนสิทธิ์ผู้ใช้เป็น "${newRole}" เรียบร้อย`);
      setUsers((prev) =>
        prev.map((u) => {
          const id = u.id || u._id;
          if (id === userId) return { ...u, role: newRole };
          return u;
        })
      );
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (u.username || '').toLowerCase().includes(term) ||
      (u.fullname || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term);
    const matchRole = roleFilter === 'all' || (u.role || '').toLowerCase() === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>จัดการสิทธิ์ผู้ใช้งาน (สำหรับ Admin)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">สลับบทบาทผู้ใช้ผ่าน PUT /users/&#123;id&#125;/role</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition flex items-center space-x-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>ดึงข้อมูลผู้ใช้ใหม่</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้ใช้, ชื่อ-นามสกุล..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          {[
            { key: 'all', label: 'ทั้งหมด' },
            { key: 'student', label: 'Student' },
            { key: 'teacher', label: 'Teacher' },
            { key: 'admin', label: 'Admin' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key)}
              className={`px-2.5 py-1 rounded-md transition ${
                roleFilter === tab.key ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
          <p className="text-xs">กำลังโหลดผู้ใช้งาน...</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
              <tr>
                <th className="p-3">ชื่อผู้ใช้</th>
                <th className="p-3">อีเมล</th>
                <th className="p-3">Role ปัจจุบัน</th>
                <th className="p-3 text-center">เปลี่ยน Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.map((u) => {
                const uId = u.id || u._id;
                const isUpdating = updatingUserId === uId;
                return (
                  <tr key={uId} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">{u.fullname || u.username}</td>
                    <td className="p-3">{u.email || '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {u.role || 'student'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <select
                        disabled={isUpdating}
                        value={u.role || 'student'}
                        onChange={(e) => handleRoleChange(uId, e.target.value)}
                        className="border border-slate-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: StudentDashboard.jsx
// ==========================================
export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('student');
  const [userProfile, setUserProfile] = useState({
    username: 'User',
    role: 'student'
  });

  useEffect(() => {
    // อ่านข้อมูลผู้ใช้จาก localStorage (ถ้ามี)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserProfile(parsed);
        if (parsed.role) setActiveTab(parsed.role.toLowerCase());
      } catch (e) {
        console.error('Error parsing user profile', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Cooperative Education Portal
              </h1>
              <p className="text-[11px] text-slate-500">ระบบคำร้องฝึกงาน / สหกิจศึกษา</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{userProfile.username}</p>
              <p className="text-[10px] text-indigo-600 uppercase font-semibold">
                Role: {userProfile.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation Tabs (สลับดูตาม Role หรือ View) */}
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-1 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition ${
              activeTab === 'student'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>ยื่นคำร้อง (นักศึกษา)</span>
          </button>

          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition ${
              activeTab === 'teacher'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ตรวจอนุมัติ (อาจารย์)</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition ${
              activeTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>จัดการผู้ใช้ (Admin)</span>
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'student' && <StudentApplicationSection />}
        {activeTab === 'teacher' && <TeacherApprovalSection />}
        {activeTab === 'admin' && <AdminUserManagementSection />}
      </main>
    </div>
  );
}