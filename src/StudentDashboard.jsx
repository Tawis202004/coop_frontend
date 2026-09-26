import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, Factory, FileSearch, ClipboardCheck, Users, 
  User, GraduationCap, Calendar, CheckCircle2, Clock, Menu, X, LogOut 
} from 'lucide-react';

const API_BASE_URL = 'https://coop-backend-02.vercel.app';

// --- Helper Component: Robot Logo ---
const RobotLogo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="24" fill="#800000" />
    <rect x="25" y="30" width="50" height="38" rx="10" fill="#FFFFFF" />
    <circle cx="40" cy="48" r="5" fill="#800000" />
    <circle cx="60" cy="48" r="5" fill="#800000" />
    <rect x="42" y="58" width="16" height="4" rx="2" fill="#800000" />
  </svg>
);

// --- Component: จัดการ/แสดงผลข้อมูลบริษัท ---
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/companies`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompanies(Array.isArray(res.data) ? res.data : res.data.companies || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("ไม่สามารถดึงข้อมูลสถานประกอบการได้");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) return <div className="p-8 text-center text-xs font-black text-gray-400">กำลังโหลดข้อมูลสถานประกอบการ...</div>;
  if (error) return <div className="p-8 text-center text-xs font-black text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
      <h3 className="text-gray-800 font-black mb-6 flex items-center gap-2 text-base">
        <Factory size={20} className="text-[#800000]" /> รายชื่อสถานประกอบการสหกิจศึกษา
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.length > 0 ? (
          companies.map((comp, idx) => (
            <div key={comp.id || idx} className="p-5 border border-gray-100 rounded-2xl hover:border-[#800000] transition-all bg-gray-50/30">
              <h4 className="font-black text-gray-800 text-sm mb-1">{comp.name || comp.company_name || 'ไม่ระบุชื่อบริษัท'}</h4>
              <p className="text-[11px] text-gray-400 font-bold mb-2">{comp.address || comp.location || 'ไม่ระบุที่อยู่'}</p>
              {comp.phone && <p className="text-[11px] text-gray-500 font-bold">📞 {comp.phone}</p>}
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 font-bold col-span-full">ไม่พบข้อมูลสถานประกอบการ</p>
        )}
      </div>
    </div>
  );
};

// --- Component: การจัดการสิทธิ์ผู้ใช้งาน (สำหรับ Coordinator) ---
const RoleManagement = () => {
  const [targetUserId, setTargetUserId] = useState('4');
  const [newRole, setNewRole] = useState('student');
  const [updating, setUpdating] = useState(false);

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!targetUserId) return alert("กรุณาระบุ User ID");
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/users/${targetUserId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`อัปเดตสิทธิ์ User ID: ${targetUserId} เป็น "${newRole}" เรียบร้อยแล้ว`);
    } catch (err) {
      console.error("Error updating role:", err);
      alert("เกิดข้อผิดพลาดในการอัปเดตสิทธิ์");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100 mb-6">
      <h3 className="text-gray-800 font-black mb-4 flex items-center gap-2 text-base">
        <Users size={20} className="text-[#800000]" /> จัดการสิทธิ์ใช้งาน (Change Role)
      </h3>
      <form onSubmit={handleUpdateRole} className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-[11px] font-black text-gray-400 block mb-1">User ID</label>
          <input 
            type="text" 
            value={targetUserId} 
            onChange={(e) => setTargetUserId(e.target.value)} 
            className="p-3 text-xs font-bold bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#800000]"
            placeholder="เช่น 4"
          />
        </div>
        <div>
          <label className="text-[11px] font-black text-gray-400 block mb-1">สิทธิ์ใหม่ (Role)</label>
          <select 
            value={newRole} 
            onChange={(e) => setNewRole(e.target.value)}
            className="p-3 text-xs font-bold bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#800000]"
          >
            <option value="student">student (นักศึกษา)</option>
            <option value="advisor">advisor (อาจารย์นิเทศก์)</option>
            <option value="coordinator">coordinator (ผู้ประสานงาน)</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={updating}
          className="bg-[#800000] hover:bg-black text-white text-xs font-black px-5 py-3 rounded-xl transition-colors"
        >
          {updating ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนสิทธิ์'}
        </button>
      </form>
    </div>
  );
};

// --- Component: อาจารย์นิเทศก์ ดูรายชื่อนักศึกษาที่ดูแล ---
const TeacherStudentsView = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/teacher/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(Array.isArray(res.data) ? res.data : res.data.students || []);
      } catch (err) {
        console.error("Error fetching teacher students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherStudents();
  }, []);

  if (loading) return <div className="p-8 text-center text-xs font-black text-gray-400">กำลังโหลดรายชื่อนักศึกษาในความดูแล...</div>;

  return (
    <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
      <h3 className="text-[#800000] font-black flex items-center gap-2 text-base mb-6">
        <Users size={24}/> รายชื่อนักศึกษาในความดูแลรับผิดชอบ (จากเซิร์ฟเวอร์)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.length > 0 ? (
          students.map((st, idx) => (
            <div key={st.id || idx} className="p-5 border border-gray-100 rounded-2xl hover:bg-red-50/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 text-[#800000] flex items-center justify-center font-black text-xs border border-gray-100 shrink-0">
                CPE
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-black text-gray-800 text-sm">{st.name || `${st.first_name || ''} ${st.last_name || ''}`}</h4>
                <p className="text-[11px] text-gray-400 font-bold">รหัสประจำตัว: {st.student_id || st.id || '-'}</p>
                <div className="pt-2">
                  <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-1 rounded-md block md:inline-block">
                    📍 {st.company || st.company_name || 'ยังไม่เลือกบริษัท'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 font-bold col-span-full">ไม่พบข้อมูลนักศึกษาในความดูแล</p>
        )}
      </div>
    </div>
  );
};

// --- Component: Coordinator Management View ---
const CoordinatorManagement = ({ activeTab }) => {
  if (activeTab === 'all_students') {
    return (
      <div className="space-y-6">
        <RoleManagement />
      </div>
    );
  }
  return null;
};

// --- Component: Advisor Management View ---
const AdvisorManagement = ({ activeTab }) => {
  if (activeTab === 'my_students') {
    return <TeacherStudentsView />;
  }
  return null;
};

// --- Main Container ---
const MainAppContainer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'student');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [profileData, setProfileData] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserProfile = async () => {
        try {
          setFetchingUser(true);
          const token = localStorage.getItem('token');
          
          let fetchUrl = `${API_BASE_URL}/student/me`;
          if (userRole === 'coordinator' || userRole === 'advisor') {
            fetchUrl = `${API_BASE_URL}/staff/me`;
          }

          const response = await axios.get(fetchUrl, {
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
    }
  }, [isLoggedIn, userRole]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setProfileData(null);
    setUserRole('student');
    setActiveTab('overview');
  };

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const displayId = profileData?.student_id || profileData?.staff_id || profileData?.username || '-';
  const displayFullName = profileData?.first_name && profileData?.last_name
    ? `${profileData.first_name} ${profileData.last_name}`
    : fetchingUser ? 'กำลังโหลด...' : 'อาจารย์ประจำวิชา / เจ้าหน้าที่';

  if (!isLoggedIn) return <LoginPage onLogin={handleLoginSuccess} />;

  const getMenuItems = () => {
    if (userRole === 'student') {
      return [
        { id: 'overview', name: 'หน้าหลัก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'บริษัท', icon: <Factory size={20}/> },
        { id: 'request', name: 'คำร้องของฉัน', icon: <FileSearch size={20}/> }
      ];
    } else if (userRole === 'coordinator') {
      return [
        { id: 'overview', name: 'แผงควบคุมหลัก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'จัดการบริษัท', icon: <Factory size={20}/> },
        { id: 'all_students', name: 'ข้อมูลสิทธิ์และปฏิทิน', icon: <Users size={20}/> }
      ];
    } else {
      return [
        { id: 'overview', name: 'หน้าแรก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'ดูรายชื่อสถานประกอบการ', icon: <Factory size={20}/> },
        { id: 'my_students', name: 'นักศึกษาในที่ปรึกษา', icon: <Users size={20}/> }
      ];
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] font-['Sarabun'] antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col shrink-0 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-24'}`}>
        <div className="p-6 flex items-center justify-center border-b border-white/10 relative h-24 shrink-0">
          <div className="flex items-center gap-3">
            <RobotLogo className="w-12 h-12 drop-shadow-md" />
            {(isSidebarOpen || window.innerWidth < 768) && (
              <span className="font-black text-base uppercase tracking-tighter text-white animate-in fade-in duration-300">
                CO-OP SYSTEM ({userRole === 'student' ? 'STUDENT' : 'STAFF'})
              </span>
            )}
          </div>
          {isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} className="absolute right-4 md:hidden p-2 hover:bg-white/10 rounded-xl">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
          {getMenuItems().map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`flex items-center w-full p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white text-[#800000] shadow-lg' : 'text-red-100/70 hover:bg-white/5'}`}>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all">
                <Menu size={20} />
              </button>
            )}
            <h2 className="font-black text-gray-800 uppercase tracking-wide text-sm md:text-base">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-3 py-1.5 rounded-2xl border border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-700">
                {userRole === 'student' ? `ST-ID: ${displayId}` : `STAFF-ID: ${displayId}`}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-red-800 uppercase bg-red-50 px-1.5 py-0.5 rounded">
                  {userRole === 'student' ? 'นักศึกษา' : userRole === 'coordinator' ? 'ผู้ประสานงาน' : 'อาจารย์นิเทศก์'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white font-black shadow-md shadow-red-900/20">
              <User size={20} />
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto space-y-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-[#800000] to-red-950 p-8 md:p-10 rounded-[35px] text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-black mb-2">
                    สวัสดีคุณ {displayFullName}!
                  </h3>
                  <p className="opacity-80 text-xs font-medium max-w-sm leading-relaxed">
                    {userRole === 'student'
                      ? 'ยินดีต้อนรับเข้าสู่ระบบจัดการสหกิจศึกษา ตรวจสอบสถานะคำร้องและข้อมูลบริษัทชั้นนำได้ทันที'
                      : 'ระบบจัดการหลังบ้านสำหรับคณาจารย์และเจ้าหน้าที่ ตรวจสอบความถูกต้องและอนุมัติสิทธิ์นักศึกษา'}
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
                        <p className="text-[11px] text-gray-400 font-bold">สิทธิ์ใช้งาน: {userRole}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && <CompanyManagement />}

            {userRole === 'coordinator' && (
              <CoordinatorManagement activeTab={activeTab} />
            )}

            {userRole === 'advisor' && (
              <AdvisorManagement activeTab={activeTab} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

// --- Component: Login Page ---
const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        username: String(username),
        password: String(password)
      };
      
      const response = await axios.post(`${API_BASE_URL}/login`, payload);
      const token = typeof response.data === 'string' ? response.data : response.data.access_token;
     
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        onLogin(role);
      } else {
        alert("ระบบได้รับข้อมูลสำเร็จ แต่ไม่พบสิทธิ์เข้าใช้งานในรูปแบบ Token");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 422) {
          alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        } else {
          alert(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: รหัสสถานะ ${error.response.status}`);
        }
      } else {
        alert("ไม่สามารถเชื่อมต่อเครือข่ายเข้ากับเซิร์ฟเวอร์หลังบ้านได้");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl w-full max-w-lg border border-gray-50 text-center">
        <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <RobotLogo className="w-18 h-18" />
        </div>
        <h1 className="text-xl font-black text-gray-800 uppercase mb-6 tracking-tighter">เข้าสู่ระบบสหกิจศึกษา</h1>
        
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setRole('student'); setUsername(''); setPassword(''); }}
            className={`py-2.5 rounded-xl font-black text-xs transition-all ${role === 'student' ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            นักศึกษา
          </button>
          <button
            type="button"
            onClick={() => { setRole('coordinator'); setUsername(''); setPassword(''); }}
            className={`py-2.5 rounded-xl font-black text-xs transition-all ${role === 'coordinator' ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            ผู้ประสานงาน
          </button>
          <button
            type="button"
            onClick={() => { setRole('advisor'); setUsername(''); setPassword(''); }}
            className={`py-2.5 rounded-xl font-black text-xs transition-all ${role === 'advisor' ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            อาจารย์นิเทศก์
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-black text-gray-400 block mb-1.5 pl-1">ชื่อบัญชีผู้ใช้งาน</label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all text-sm"
              placeholder={role === 'student' ? "รหัสนักศึกษา" : "ชื่อบัญชีบุคลากร"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-black text-gray-400 block mb-1.5 pl-1">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#800000] text-white py-4 mt-2 rounded-2xl font-black shadow-xl hover:bg-black transition-all text-sm tracking-wider">
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainAppContainer;