import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, Factory, FileSearch, ClipboardCheck, Users, 
  X, LogOut, Menu, User, GraduationCap, Calendar, 
  CheckCircle2, Clock, Plus, Search, Edit2, Trash2, Save
} from 'lucide-react';

// ==========================================
// CONFIG & CONSTANTS
// ==========================================
const API_BASE_URL = 'https://coop-backend-02.vercel.app';

// ==========================================
// SUB-COMPONENTS
// ==========================================

// 1. Robot Logo Component
const RobotLogo = () => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
      🤖
    </div>
    <span className="font-bold text-lg text-slate-800">Coop System</span>
  </div>
);

// 2. Company Management Component
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: 'บริษัท เทคโนโลยีสยาม จำกัด', industry: 'Software Development', contact: '02-123-4567', status: 'Active' },
    { id: 2, name: 'บริษัท นวัตกรรมดิจิทัล จำกัด', industry: 'Data Analytics', contact: '02-987-6543', status: 'Active' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">จัดการข้อมูลสถานประกอบการ</h2>
          <p className="text-sm text-slate-500">จัดการรายชื่อบริษัท partner และรายละเอียดการติดต่อ</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">
          <Plus className="w-4 h-4" />
          <span>เพิ่มบริษัท</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาตามชื่อบริษัท หรือประเภทธุรกิจ..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-4 font-semibold">ชื่อสถานประกอบการ</th>
                <th className="p-4 font-semibold">ประเภทธุรกิจ</th>
                <th className="p-4 font-semibold">เบอร์โทรศัพท์</th>
                <th className="p-4 font-semibold">สถานะ</th>
                <th className="p-4 font-semibold text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCompanies.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-900">{comp.name}</td>
                  <td className="p-4">{comp.industry}</td>
                  <td className="p-4">{comp.contact}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                      {comp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 hover:text-indigo-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 3. Coordinator Management Component
const CoordinatorManagement = ({ activeTab }) => {
  if (activeTab === 'manage_requests') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">อนุมัติคำร้องนักศึกษา</h2>
          <p className="text-sm text-slate-500">พิจารณาคำร้องขอออกฝึกงานและสหกิจศึกษา</p>
        </div>
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
          <Clock className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">ไม่มีคำร้องค้างพิจารณา</h3>
          <p className="text-slate-500 text-sm mt-1">คำร้องทั้งหมดได้รับการอนุมัติเรียบร้อยแล้ว</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">ข้อมูลสิทธิ์และปฏิทินนักศึกษา</h2>
        <p className="text-sm text-slate-500">ตรวจสอบรายชื่อนักศึกษาและกำหนดการออกฝึกงาน</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-600">แสดงข้อมูลปฏิทินและสิทธิ์ประจำปีการศึกษาปัจจุบัน...</p>
      </div>
    </div>
  );
};

// 4. Advisor Management Component
const AdvisorManagement = ({ activeTab }) => {
  if (activeTab === 'supervise') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">บันทึกการนิเทศงาน</h2>
          <p className="text-sm text-slate-500">บันทึกผลการลงพื้นที่นิเทศและประเมินผลการฝึกงาน</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">เลือกนักศึกษา</label>
              <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500">
                <option value="">-- กรุณาเลือกนักศึกษา --</option>
                <option value="1">นาย สมชาย ใจดี (บริษัท เทคโนโลยีสยาม)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">วันที่นิเทศ</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ความเห็นอาจารย์นิเทศก์</label>
            <textarea rows="4" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="ระบุรายละเอียดผลการนิเทศ..."></textarea>
          </div>
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
            <Save className="w-4 h-4" />
            <span>บันทึกการนิเทศ</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">นักศึกษาในที่ปรึกษา</h2>
        <p className="text-sm text-slate-500">รายชื่อนักศึกษาที่อยู่ภายใต้การดูแล</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-600">แสดงรายชื่อนักศึกษาในความดูแลทั้งหมด...</p>
      </div>
    </div>
  );
};

// ==========================================
// LOGIN PAGE COMPONENT
// ==========================================
const LoginPage = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    let endpoint = '';
    let payload = {};

    if (activeTab === 'student') {
      endpoint = `${API_BASE_URL}/api/auth/student-login`;
      payload = { student_id: username, password: password };
    } else {
      endpoint = `${API_BASE_URL}/api/auth/login`;
      payload = { username: username, password: password };
    }

    try {
      const response = await axios.post(endpoint, payload);
      const data = response.data;

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', activeTab === 'student' ? 'student' : (data.role || 'staff'));
        onLoginSuccess();
      } else {
        setErrorMsg('ไม่ได้รับ Token จากเซิร์ฟเวอร์');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-indigo-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/30">
              🤖
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ระบบสหกิจศึกษา</h1>
          <p className="text-indigo-100 text-sm mt-1">Cooperative Education System</p>
        </div>

        {/* Tab Selector */}
        <div className="p-6">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleTabChange('student')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'student'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>นักศึกษา</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('staff')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'staff'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span>อาจารย์ / เจ้าหน้าที่</span>
            </button>
          </div>

          {/* Alert Message */}
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg flex items-center space-x-2">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                {activeTab === 'student' ? 'รหัสนักศึกษา' : 'ชื่อผู้ใช้งาน (Username)'}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activeTab === 'student' ? 'เช่น 640123456' : 'กรอกชื่อผู้ใช้งาน'}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                รหัสผ่าน (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm text-slate-800 placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// MAIN APP CONTAINER COMPONENT
// ==========================================
export default function MainAppContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(true);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('companies');

  const checkAuthAndFetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setFetchingUser(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      handleLogout();
    } finally {
      setFetchingUser(false);
    }
  };

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (fetchingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">กำลังโหลดข้อมูลระบบ...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={checkAuthAndFetchProfile} />;
  }

  const role = currentUser?.role || localStorage.getItem('role') || 'staff';

  const menuItems = [
    { id: 'companies', label: 'จัดการสถานประกอบการ', icon: Factory, roles: ['admin', 'staff', 'coordinator'] },
    { id: 'manage_requests', label: 'อนุมัติคำร้องนักศึกษา', icon: ClipboardCheck, roles: ['admin', 'coordinator'] },
    { id: 'all_students', label: 'ข้อมูลสิทธิ์/ปฏิทินนักศึกษา', icon: Users, roles: ['admin', 'coordinator'] },
    { id: 'supervise', label: 'บันทึกการนิเทศงาน', icon: FileSearch, roles: ['admin', 'advisor'] },
    { id: 'my_students', label: 'นักศึกษาในที่ปรึกษา', icon: Users, roles: ['admin', 'advisor'] },
  ];

  const allowedMenuItems = menuItems.filter(item => item.roles.includes(role) || role === 'admin');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
              <RobotLogo />
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-800">
                  {currentUser?.fullname || currentUser?.username || 'ผู้ใช้งาน'}
                </span>
                <span className="text-xs text-slate-500 capitalize">
                  สิทธิ์การใช้งาน: {role}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm sticky top-22">
            <div className="text-xs font-bold text-slate-400 uppercase px-3 mb-2 tracking-wider">
              เมนูหลัก
            </div>
            <nav className="space-y-1">
              {allowedMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Drawer Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div className="fixed inset-0 bg-slate-600/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <RobotLogo />
                <button onClick={() => setSidebarOpen(false)} className="text-slate-500 p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto space-y-1">
                {allowedMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'companies' && <CompanyManagement />}
          
          {(activeTab === 'manage_requests' || activeTab === 'all_students') && (
            <CoordinatorManagement activeTab={activeTab} />
          )}

          {(activeTab === 'supervise' || activeTab === 'my_students') && (
            <AdvisorManagement activeTab={activeTab} />
          )}
        </main>

      </div>
    </div>
  );
}