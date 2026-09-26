import React, { useState, useEffect } from 'react';
import api from './api';
import { 
  Users, BarChart3, Factory, FileSearch, ClipboardCheck, 
  X, LogOut, Menu, User, GraduationCap, Calendar, CheckCircle2, Clock, Mail
} from 'lucide-react';

// --- LoginPage Component ---
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
     
      const response = await api.post('/login', payload);
      const token = typeof response.data === 'string' ? response.data : response.data.access_token;
     
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        onLogin(role);
      } else {
        alert("ระบบได้รับข้อมูลสำเร็จ แต่ไม่พบ Token เข้าใช้งาน");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert(`ไม่พบเส้นทาง API (${error.config?.url})`);
        } else if (error.response.status === 401 || error.response.status === 422) {
          alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        } else {
          alert(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.response.status}`);
        }
      } else {
        alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      }
    } finally {
      setLoading(false);
    }
  };

  const getUsernamePlaceholder = () => {
    if (role === 'student') return "รหัสนักศึกษา";
    if (role === 'coordinator') return "ชื่อบัญชีอาจารย์ผู้ประสานงาน";
    return "ชื่อบัญชีอาจารย์นิเทศก์";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl w-full max-w-lg border border-gray-50 text-center">
        <h1 className="text-xl font-black text-[#800000] uppercase mb-6 tracking-tighter">
          เข้าสู่ระบบ CO-OP SYSTEM
        </h1>
       
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
              placeholder={getUsernamePlaceholder()}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-black text-gray-400 block mb-1.5 pl-1">รหัสผ่านสำหรับเข้าสู่ระบบ</label>
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
            {loading ? 'กำลังเข้าสู่ระบบ...' : `เข้าสู่ระบบในฐานะ${role === 'student' ? 'นักศึกษา' : role === 'coordinator' ? 'ผู้ประสานงาน' : 'อาจารย์นิเทศก์'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
function StudentDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'student');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  const [profileData, setProfileData] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // ดึงข้อมูลผู้ใช้งานตาม role ผ่าน api.js
  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserProfile = async () => {
        try {
          setFetchingUser(true);
          setFetchError(null);
          
          let endpoint = '/student/me';
          if (userRole === 'coordinator' || userRole === 'advisor') {
            endpoint = '/staff/me';
          }

          const response = await api.get(endpoint);
         
          if (Array.isArray(response.data)) {
            setProfileData(response.data[0]);
          } else if (response.data?.user) {
            setProfileData(Array.isArray(response.data.user) ? response.data.user[0] : response.data.user);
          } else {
            setProfileData(response.data);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          setFetchError('ไม่สามารถดึงข้อมูลได้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
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
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setProfileData(null);
    setUserRole('student');
    setActiveTab('overview');
  };

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const displayId = profileData?.studentId || profileData?.student_id || profileData?.staff_id || profileData?.id || '-';
  const displayFullName = profileData?.name || (profileData?.first_name && profileData?.last_name
    ? `${profileData.first_name} ${profileData.last_name}`
    : profileData?.firstname) || (fetchingUser ? 'กำลังโหลด...' : 'ผู้ใช้งานระบบ');

  if (!isLoggedIn) return <LoginPage onLogin={handleLoginSuccess} />;

  const getMenuItems = () => {
    if (userRole === 'student') {
      return [
        { id: 'overview', name: 'หน้าหลัก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'บริษัท', icon: <Factory size={20}/> },
        { id: 'request', name: 'คำร้องของฉัน', icon: <FileSearch size={20}/> }
      ];
    } else {
      return [
        { id: 'overview', name: 'แผงควบคุมหลัก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'จัดการบริษัท', icon: <Factory size={20}/> },
        { id: 'manage_requests', name: 'อนุมัติคำร้องนักศึกษา', icon: <ClipboardCheck size={20}/> }
      ];
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] font-sans antialiased overflow-hidden">
     
      {/* Sidebar Navigation */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col shrink-0 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-24'}`}>
        <div className="p-6 flex items-center justify-center border-b border-white/10 relative h-24 shrink-0">
          <span className="font-black text-lg tracking-wider text-white">
            CO-OP
          </span>
          {isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} className="absolute right-4 md:hidden p-2 hover:bg-white/10 rounded-xl">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
          {getMenuItems().map(item => (
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
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all">
                <Menu size={20} />
              </button>
            )}
            <h2 className="font-black text-gray-800 uppercase tracking-wide text-sm md:text-base">
              {activeTab === 'overview' ? 'Student Dashboard' : activeTab}
            </h2>
          </div>
         
          <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-3 py-1.5 rounded-2xl border border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-700">ID: {displayId}</p>
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

        {/* Board Content */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto space-y-6">
           
            {fetchError && (
              <div className="p-4 bg-red-100 text-red-700 rounded-2xl text-xs font-bold border border-red-200">
                {fetchError}
              </div>
            )}

            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Banner */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-[#800000] to-red-950 p-8 md:p-10 rounded-[35px] text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl font-black mb-2">
                      {fetchingUser ? 'กำลังโหลดข้อมูล...' : `สวัสดีคุณ ${displayFullName}!`}
                    </h3>
                    <p className="opacity-80 text-xs font-medium max-w-sm leading-relaxed">
                      {userRole === 'student'
                        ? 'ยินดีต้อนรับเข้าสู่ระบบจัดการสหกิจศึกษา ตรวจสอบสถานะคำร้องและข้อมูลบริษัทชั้นนำได้ทันที'
                        : 'ระบบจัดการหลังบ้านสำหรับคณาจารย์และเจ้าหน้าที่ ตรวจสอบความถูกต้องและอนุมัติสิทธิ์นักศึกษา'}
                    </p>
                  </div>

                  {/* Profile Card */}
                  <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-red-50 text-[#800000] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                        ข้อมูลผู้ใช้งาน
                      </span>
                     
                      <div className="flex items-center gap-3 mt-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
                          <GraduationCap size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-800">{displayFullName}</p>
                          <p className="text-[11px] text-gray-400 font-bold">รหัส: {displayId}</p>
                        </div>
                      </div>
                    </div>
                   
                    <div className="border-t border-gray-50 pt-3 mt-4 space-y-2 text-xs text-gray-500 font-bold">
                      <p className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-gray-700 font-black">{profileData?.email || 'ไม่ระบุอีเมล'}</span>
                      </p>
                      {userRole === 'student' && (
                        <>
                          <p>คณะ: <span className="text-gray-700 font-black">{profileData?.faculty || 'ไม่ระบุคณะ'}</span></p>
                          <p>สาขา: <span className="text-gray-700 font-black">{profileData?.major || 'ไม่ระบุสาขา'}</span></p>
                        </>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full mt-2 py-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 rounded-xl font-black text-xs transition-colors"
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Stats */}
                <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                  <h4 className="text-gray-800 font-black mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-[#800000]"/>
                    {userRole === 'student' ? 'สรุปสถานะคำร้องส่วนตัว' : 'ภาพรวมข้อมูลคำร้องในระบบทั้งหมด'}
                  </h4>
                 
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-emerald-600 mb-1">อนุมัติเรียบร้อย</p>
                        <h5 className="text-2xl font-black text-emerald-700">{userRole === 'student' ? '1' : '45'} <span className="text-xs font-bold text-emerald-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xs font-black text-emerald-700 shadow-sm border-2 border-emerald-400">OK</div>
                    </div>

                    <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-amber-600 mb-1">รอการตรวจสอบ</p>
                        <h5 className="text-2xl font-black text-amber-700">{userRole === 'student' ? '1' : '12'} <span className="text-xs font-bold text-amber-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xs font-black text-amber-700 shadow-sm border-2 border-amber-300">WAIT</div>
                    </div>

                    <div className="p-5 bg-red-50/40 border border-red-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-red-600 mb-1">ปฏิเสธ/รอแก้ไข</p>
                        <h5 className="text-2xl font-black text-red-700">0 <span className="text-xs font-bold text-red-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xs font-black text-gray-400 shadow-sm border-2 border-gray-200">0</div>
                    </div>
                  </div>
                </div>

                {/* Student Timeline */}
                {userRole === 'student' && (
                  <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                    <h4 className="text-gray-800 font-black mb-8 flex items-center gap-2">
                      <Calendar size={20} className="text-[#800000]"/> ไทม์ไลน์ขั้นตอนการดำเนินงาน (Co-op Timeline)
                    </h4>
                    <div className="relative border-l-2 border-red-100 ml-4 md:ml-6 space-y-8 pb-4">
                      <div className="relative pl-8">
                        <div className="absolute -left-[13px] top-0 bg-emerald-500 text-white p-1 rounded-full">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md">เสร็จสิ้นแล้ว</span>
                          <h5 className="text-sm font-black text-gray-800 mt-1">ยื่นใบสมัครและเลือกสถานประกอบการ</h5>
                        </div>
                      </div>
                      <div className="relative pl-8">
                        <div className="absolute -left-[13px] top-0 bg-amber-400 text-white p-1 rounded-full">
                          <Clock size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded-md">กำลังดำเนินงาน</span>
                          <h5 className="text-sm font-black text-gray-800 mt-1">อาจารย์และเจ้าหน้าที่ตรวจสอบคำร้อง</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'company' && (
              <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-800 text-lg mb-4">รายชื่อสถานประกอบการ</h3>
                <p className="text-xs text-gray-500">ข้อมูลบริษัทที่เข้าร่วมโครงการสหกิจศึกษา</p>
              </div>
            )}

            {activeTab === 'request' && (
              <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                <FileSearch size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-black text-gray-800">หน้าต่างตรวจสอบคำร้องนักศึกษา</h3>
                <p className="text-xs text-gray-400 font-bold mt-2">คำร้องของคุณกำลังอยู่ในกระบวนการพิจารณาตรวจสอบความถูกต้อง</p>
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;