import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  Factory, 
  FileSearch, 
  UserCheck, 
  LogOut, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  GraduationCap 
} from 'lucide-react';

const API_BASE_URL = 'https://coop-backend-02.vercel.app';

// ==========================================
// Sub-Component: ส่วนแสดงข้อมูลอาจารย์ที่ดูแล
// ==========================================
const AdvisorInfoView = () => {
  const [advisorData, setAdvisorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvisorInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_BASE_URL}/teacher/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Raw Advisor Response:", response.data);

        // --- Robust Mapping Logic ดักจับ Response JSON ทุกรูปแบบ ---
        const resData = response.data;
        let extractedAdvisor = null;

        if (Array.isArray(resData)) {
          extractedAdvisor = resData[0] || null;
        } else if (resData && typeof resData === 'object') {
          extractedAdvisor = 
            resData.teacher || 
            resData.advisor || 
            resData.data?.[0] || 
            resData.data || 
            (resData.first_name || resData.name || resData.staff_id ? resData : null);
        }

        setAdvisorData(extractedAdvisor);
      } catch (err) {
        console.error("Error fetching advisor info:", err);
        if (err.response?.status === 404) {
          setError("ยังไม่มีอาจารย์นิเทศก์ที่ได้รับมอบหมายในขณะนี้");
        } else {
          setError("ไม่สามารถโหลดข้อมูลอาจารย์ที่ดูแลได้");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisorInfo();
  }, []);

  // --- Normalization Data (ดักจับฟิลด์หลากหลายรูปแบบจาก Database) ---
  const firstName = advisorData?.first_name || advisorData?.firstname || advisorData?.name?.split(' ')[0] || '';
  const lastName = advisorData?.last_name || advisorData?.lastname || advisorData?.name?.split(' ')[1] || '';
  const fullName = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : advisorData?.name || advisorData?.username || 'อาจารย์นิเทศก์ประจำตัว';

  const email = advisorData?.email || advisorData?.contact_email || 'ไม่ระบุอีเมล';
  const phone = advisorData?.phone || advisorData?.tel || advisorData?.mobile || 'ไม่ระบุเบอร์โทรศัพท์';
  const department = advisorData?.department || advisorData?.faculty || advisorData?.major || 'สาขาวิชาวิศวกรรมคอมพิวเตอร์';
  const staffId = advisorData?.staff_id || advisorData?.teacher_id || advisorData?.id || '-';

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-[35px] text-center border border-gray-100 shadow-sm">
        <div className="animate-spin w-8 h-8 border-4 border-[#800000] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-xs font-bold text-gray-500">กำลังโหลดข้อมูลอาจารย์ผู้ดูแล...</p>
      </div>
    );
  }

  if (error || !advisorData) {
    return (
      <div className="bg-white p-12 md:p-16 rounded-[40px] text-center border-2 border-dashed border-gray-100">
        <UserCheck size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="font-black text-gray-800 text-lg">ยังไม่พบข้อมูลอาจารย์นิเทศก์</h3>
        <p className="text-xs text-gray-400 font-bold mt-2">
          {error || 'ขณะนี้ระบบยังไม่ได้ทำการมอบหมายอาจารย์นิเทศก์ให้แก่บัญชีของคุณ'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
      <h4 className="text-gray-800 font-black mb-6 flex items-center gap-2">
        <UserCheck size={20} className="text-[#800000]" />
        อาจารย์ที่ดูแล (Advisor)
      </h4>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-gradient-to-br from-red-50/60 to-red-50/20 p-6 md:p-8 rounded-[30px] border border-red-100/50">
        {/* Avatar */}
        <div className="w-20 h-20 bg-[#800000] text-white rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 shadow-lg shadow-red-900/10">
          {firstName ? firstName.charAt(0) : <User size={32} />}
        </div>

        {/* ข้อมูลการติดต่อ */}
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <span className="text-[10px] font-black bg-red-100 text-[#800000] px-2.5 py-0.5 rounded-md uppercase">
                STAFF ID: {staffId}
              </span>
            </div>
            <h5 className="text-xl font-black text-gray-800">{fullName}</h5>
            <p className="text-xs font-bold text-gray-500 mt-0.5">อาจารย์นิเทศก์ประจำตัวนักศึกษา</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-red-100/80 text-xs text-gray-600 font-bold">
            <div className="flex items-center justify-center md:justify-start gap-2.5 bg-white/80 p-3 rounded-2xl border border-red-50">
              <Mail size={16} className="text-[#800000] shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2.5 bg-white/80 p-3 rounded-2xl border border-red-50">
              <Phone size={16} className="text-[#800000] shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2.5 bg-white/80 p-3 rounded-2xl border border-red-50 sm:col-span-2">
              <Building size={16} className="text-[#800000] shrink-0" />
              <span className="truncate">สังกัด: {department}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Main Component: StudentDashboard
// ==========================================
const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setFetchingUser(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/student/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(response.data)) {
          setProfileData(response.data[0]);
        } else if (response.data?.user) {
          setProfileData(Array.isArray(response.data.user) ? response.data.user[0] : response.data.user);
        } else {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setFetchingUser(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const displayId = profileData?.student_id || profileData?.username || '-';
  const displayFullName = profileData?.first_name && profileData?.last_name
    ? `${profileData.first_name} ${profileData.last_name}`
    : fetchingUser ? 'กำลังโหลด...' : 'นักศึกษา';

  // รายการ เมนูฝั่งนักศึกษา
  const menuItems = [
    { id: 'overview', name: 'หน้าหลัก', icon: <BarChart3 size={20}/> },
    { id: 'company', name: 'บริษัท', icon: <Factory size={20}/> },
    { id: 'request', name: 'คำร้องของฉัน', icon: <FileSearch size={20}/> },
    { id: 'advisor', name: 'อาจารย์ที่ดูแล', icon: <UserCheck size={20}/> } // <-- เมนูที่เพิ่มใหม่
  ];

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] font-['Sarabun'] antialiased overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col shrink-0 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-24'}`}>
        <div className="p-6 flex items-center justify-center border-b border-white/10 relative h-24 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-black text-base uppercase tracking-tighter text-white">
              CO-OP STUDENT
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
              className={`flex items-center w-full p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white text-[#800000] shadow-lg' : 'text-red-100/70 hover:bg-white/5'}`}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-4 text-xs font-black uppercase tracking-wide">{item.name}</span>}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="p-8 flex items-center text-red-200 hover:text-white transition-colors border-t border-white/5 shrink-0">
          <LogOut size={20} />
          {isSidebarOpen && <span className="ml-4 font-black text-xs uppercase">LOGOUT</span>}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-black text-gray-800 uppercase tracking-wide text-sm md:text-base">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'advisor' ? 'อาจารย์ที่ดูแล' : activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-3 py-1.5 rounded-2xl border border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-700">ST-ID: {displayId}</p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-red-800 uppercase bg-red-50 px-1.5 py-0.5 rounded">นักศึกษา</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white font-black shadow-md shadow-red-900/20">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Dynamic Content Body */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* 1. Tab Overview */}
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-gradient-to-br from-[#800000] to-red-950 p-8 md:p-10 rounded-[35px] text-white shadow-xl flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl font-black mb-2">สวัสดีคุณ {displayFullName}!</h3>
                    <p className="opacity-80 text-xs font-medium max-w-sm leading-relaxed">
                      ยินดีต้อนรับเข้าสู่ระบบจัดการสหกิจศึกษา ตรวจสอบสถานะคำร้องและข้อมูลอาจารย์ผู้ดูแลได้ทันที
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-red-50 text-[#800000] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                        บัญชีผู้ใช้งานปัจจุบัน
                      </span>
                      <div className="flex items-center gap-3 mt-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500"><GraduationCap size={24} /></div>
                        <div>
                          <p className="text-xs font-black text-gray-800">{displayFullName}</p>
                          <p className="text-[11px] text-gray-400 font-bold">สิทธิ์ใช้งาน: Student</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-50 pt-3 mt-4 space-y-1.5 text-xs text-gray-500 font-bold">
                      <p>คณะ: <span className="text-gray-700 font-black">{profileData?.faculty || 'ไม่ระบุคณะ'}</span></p>
                      <p>สาขา: <span className="text-gray-700 font-black">{profileData?.major || 'ไม่ระบุสาขา'}</span></p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                  <h4 className="text-gray-800 font-black mb-8 flex items-center gap-2">
                    <Calendar size={20} className="text-[#800000]"/> ไทม์ไลน์ขั้นตอนการดำเนินงาน (Co-op Timeline)
                  </h4>
                  <div className="relative border-l-2 border-red-100 ml-4 md:ml-6 space-y-8 pb-4">
                    <div className="relative pl-8">
                      <div className="absolute -left-[13px] top-0 bg-emerald-500 text-white p-1 rounded-full"><CheckCircle2 size={16} /></div>
                      <div>
                        <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md">เสร็จสิ้นแล้ว</span>
                        <h5 className="text-sm font-black text-gray-800 mt-1">ยื่นใบสมัครและเลือกสถานประกอบการ</h5>
                      </div>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute -left-[13px] top-0 bg-amber-400 text-white p-1 rounded-full"><Clock size={16} /></div>
                      <div>
                        <span className="text-[10px] text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded-md">กำลังดำเนินงาน</span>
                        <h5 className="text-sm font-black text-gray-800 mt-1">อาจารย์และเจ้าหน้าที่ตรวจสอบคำร้อง</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 2. Tab Advisor (เพิ่ม API ดูข้อมูลอาจารย์ที่ดูแล) */}
            {activeTab === 'advisor' && <AdvisorInfoView />}

            {/* 3. Fallbacks สำหรับ Tab อื่นๆ */}
            {activeTab === 'company' && (
              <div className="bg-white p-12 rounded-[35px] text-center border border-gray-100">
                <Factory size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-black text-gray-800">รายชื่อสถานประกอบการ</h3>
              </div>
            )}

            {activeTab === 'request' && (
              <div className="bg-white p-12 rounded-[35px] text-center border border-gray-100">
                <FileSearch size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-black text-gray-800">หน้าต่างตรวจสอบคำร้องนักศึกษา</h3>
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;