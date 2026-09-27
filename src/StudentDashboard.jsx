import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import {
  BarChart3,
  LogOut,
  Menu,
  X,
  Factory,
  FileSearch,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Building2,
  Info,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  GraduationCap,
  ClipboardCheck,
  Users,
  Eye,
  EyeOff,
  Download,
  Plus,
  Trash2,
  Edit3,
  Save,
  RefreshCw,
  UserCog
} from 'lucide-react';


// ============================================================
// CONFIGURATION
// ============================================================

const API_BASE_URL = 'https://coop-backend-02.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


// ============================================================
// AXIOS TOKEN INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ============================================================
// ERROR HELPER
// ป้องกัน [object Object]
// ============================================================

const stringifyValue = (value) => {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => stringifyValue(item))
      .join(', ');
  }

  if (typeof value === 'object') {
    return (
      value.name ||
      value.label ||
      value.title ||
      value.company_name ||
      value.first_name ||
      JSON.stringify(value)
    );
  }

  return String(value);
};


const getErrorMessage = (error) => {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
  }

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item) => {
        if (typeof item === 'string') return item;

        const location = Array.isArray(item.loc)
          ? item.loc.join(' → ')
          : '';

        return [
          location ? `[${location}]` : '',
          item.msg || '',
        ]
          .filter(Boolean)
          .join(' ');
      })
      .join('\n');
  }

  if (typeof data.detail === 'string') {
    return data.detail;
  }

  if (data.message) {
    return data.message;
  }

  if (typeof data === 'string') {
    return data;
  }

  return JSON.stringify(data, null, 2);
};


// ============================================================
// DATA NORMALIZERS
// ============================================================

const normalizeArray = (data, possibleKeys = []) => {
  if (Array.isArray(data)) {
    return data;
  }

  for (const key of possibleKeys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
};


// ============================================================
// STUDENT HELPERS
// ============================================================

const getStudentObject = (application) => {
  if (!application) return null;

  if (
    application.student &&
    typeof application.student === 'object'
  ) {
    return application.student;
  }

  if (
    application.student_info &&
    typeof application.student_info === 'object'
  ) {
    return application.student_info;
  }

  return null;
};


const getStudentId = (application) => {
  const student = getStudentObject(application);

  return (
    application?.student_id ||
    student?.student_id ||
    student?.id ||
    student?.user_id ||
    '-'
  );
};


const getStudentName = (application) => {
  const student = getStudentObject(application);

  if (application?.student_name) {
    return stringifyValue(application.student_name);
  }

  if (student) {
    if (student.name) {
      return stringifyValue(student.name);
    }

    const fullName = [
      student.prefix,
      student.first_name,
      student.last_name
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    if (fullName) {
      return fullName;
    }

    if (student.username) {
      return stringifyValue(student.username);
    }
  }

  if (
    application?.first_name ||
    application?.last_name
  ) {
    return [
      application.first_name,
      application.last_name
    ]
      .filter(Boolean)
      .join(' ');
  }

  return '-';
};


const getStudentMajor = (application) => {
  const student = getStudentObject(application);

  return (
    application?.major ||
    application?.major_name ||
    application?.program ||
    student?.major ||
    student?.major_name ||
    student?.program ||
    student?.department ||
    '-'
  );
};


// ============================================================
// COMPANY HELPERS
// ============================================================

const getCompanyObject = (application) => {
  if (!application) return null;

  if (
    application.company &&
    typeof application.company === 'object'
  ) {
    return application.company;
  }

  if (
    application.company_info &&
    typeof application.company_info === 'object'
  ) {
    return application.company_info;
  }

  return null;
};


const getCompanyId = (company) => {
  if (!company) return null;

  if (typeof company === 'number') {
    return company;
  }

  if (typeof company === 'string') {
    return Number(company);
  }

  return (
    company.id ||
    company.company_id ||
    null
  );
};


const getCompanyName = (value) => {
  if (!value) {
    return '-';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'object') {
    return (
      value.company_name ||
      value.name ||
      value.companyName ||
      value.title ||
      '-'
    );
  }

  return '-';
};


const getApplicationCompanyName = (application) => {
  const company = getCompanyObject(application);

  if (company) {
    return getCompanyName(company);
  }

  return getCompanyName(
    application?.company_name ||
    application?.companyName ||
    application?.company
  );
};


// ============================================================
// STATUS HELPERS
// ============================================================

const getApplicationStatus = (application) => {
  const status =
    application?.status ||
    application?.application_status ||
    application?.state ||
    '';

  if (typeof status === 'object') {
    return (
      status.name ||
      status.status ||
      status.label ||
      '-'
    );
  }

  return status || '-';
};


const statusText = (status) => {
  const normalized = String(status).toLowerCase();

  if (
    normalized.includes('approve') ||
    normalized.includes('อนุมัติ')
  ) {
    return 'อนุมัติเรียบร้อย';
  }

  if (
    normalized.includes('reject') ||
    normalized.includes('ปฏิเสธ')
  ) {
    return 'ปฏิเสธคำร้อง';
  }

  if (
    normalized.includes('wait') ||
    normalized.includes('pending') ||
    normalized.includes('รอ')
  ) {
    return 'รอตรวจสอบ';
  }

  return status || '-';
};


const statusClass = (status) => {
  const normalized = String(status).toLowerCase();

  if (
    normalized.includes('approve') ||
    normalized.includes('อนุมัติ')
  ) {
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  }

  if (
    normalized.includes('reject') ||
    normalized.includes('ปฏิเสธ')
  ) {
    return 'bg-red-50 text-red-600 border-red-100';
  }

  return 'bg-amber-50 text-amber-600 border-amber-100';
};


// ============================================================
// LOGO
// ============================================================

const RobotLogo = ({ className = 'w-10 h-10' }) => (
  <svg
    className={className}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M482.3 221.7l-35.9-5.9c-3.9-15.6-9.9-30.4-17.7-44l21.3-29.4c6.3-8.7 5.1-20.9-2.9-28.2l-32.9-30c-7.9-7.2-20.2-7.2-28 0l-22.5 19.3c-14.1-8.9-29.6-15.6-46.1-19.8l-7-35.7C312 36.5 302 28 290.3 28h-44.5c-11.7 0-21.7 8.5-23.4 20l-7 35.7c-16.5 4.2-32 10.9-46.1 19.8L146.8 84.2c-7.8-7.2-20.1-7.2-28 0l-32.9 30c-8 7.3-9.2 19.5-2.9 28.2l21.3 29.4c-7.8 13.6-13.8 28.4-17.7 44l-35.9 5.9C39 223.4 30.5 233.1 30.5 244.7v44.5c0 11.6 8.5 21.3 20.2 23l35.9 5.9c3.9 15.6 9.9 30.4 17.7 44l-21.3 29.4c-6.3 8.7-5.1 20.9 2.9 28.2l32.9 30c7.9 7.2 20.2 7.2 28 0l22.5-19.3c14.1 8.9 29.6 15.6 46.1 19.8l7 35.7c1.7 11.5 11.7 20 23.4 20h44.5c11.7 0 21.7-8.5 23.4-20l7-35.7c16.5-4.2 32-10.9 46.1-19.8l22.5 19.3c7.8 7.2 20.1 7.2 28 0l32.9-30c8-7.3 9.2-19.5 2.9-28.2l-21.3-29.4c7.8-13.6 13.8-28.4 17.7-44l35.9-5.9c11.7-1.7 20.2-11.4 20.2-23v-44.5c0-11.6-8.5-21.3-20.2-23z"
      fill="#ff4d4d"
      stroke="#000"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="256"
      cy="256"
      r="135"
      fill="#fff"
      stroke="#000"
      strokeWidth="16"
    />
    <rect
      x="180"
      y="210"
      width="152"
      height="100"
      rx="25"
      fill="#e0e0e0"
      stroke="#000"
      strokeWidth="16"
    />
    <circle cx="225" cy="260" r="14" fill="#000" />
    <circle cx="287" cy="260" r="14" fill="#000" />
    <rect
      x="148"
      y="235"
      width="32"
      height="50"
      rx="16"
      fill="#b0b0b0"
      stroke="#000"
      strokeWidth="16"
    />
    <rect
      x="332"
      y="235"
      width="32"
      height="50"
      rx="16"
      fill="#b0b0b0"
      stroke="#000"
      strokeWidth="16"
    />
    <line
      x1="256"
      y1="210"
      x2="256"
      y2="175"
      stroke="#000"
      strokeWidth="16"
      strokeLinecap="round"
    />
    <circle
      cx="256"
      cy="160"
      r="18"
      fill="#ff4d4d"
      stroke="#000"
      strokeWidth="12"
    />
    <line
      x1="230"
      y1="290"
      x2="282"
      y2="290"
      stroke="#000"
      strokeWidth="8"
      strokeLinecap="round"
    />
  </svg>
);


// ============================================================
// COMPANY MANAGEMENT
// ============================================================

const CompanyManagement = ({
  userRole,
  profileData,
  onApply
}) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const emptyForm = {
    company_name: '',
    address: '',
    phone: '',
    industry: '',
    allowance: '',
    accommodation: '',
    shuttle: '',
    welfare: ''
  };

  const [form, setForm] = useState(emptyForm);

  const canManageCompanies =
    userRole === 'coordinator';

  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const response = await api.get('/companies');

      const data = normalizeArray(
        response.data,
        ['companies', 'data', 'items']
      );

      setCompanies(data);

    } catch (error) {
      console.error('Fetch companies error:', error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies();
    }, 250);

    return () => clearTimeout(timer);
  }, []);


  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const name = stringifyValue(
        company.company_name ||
        company.name
      ).toLowerCase();

      const industry = stringifyValue(
        company.industry
      ).toLowerCase();

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm.toLowerCase()) ||
        industry.includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterIndustry === 'All') return true;

      if (filterIndustry === 'Industry') {
        return (
          industry.includes('อุตสาหกรรม') ||
          industry.includes('manufacture') ||
          industry.includes('factory')
        );
      }

      if (filterIndustry === 'IT') {
        return (
          industry.includes('เทคโนโลยี') ||
          industry.includes('it') ||
          industry.includes('tech')
        );
      }

      if (filterIndustry === 'Other') {
        return !industry || industry === '-';
      }

      return true;
    });
  }, [companies, searchTerm, filterIndustry]);


  const handleSubmitCompany = async (event) => {
    event.preventDefault();

    try {
      if (!form.company_name.trim()) {
        alert('กรุณาระบุชื่อบริษัท');
        return;
      }

      if (editingCompany) {
        await api.put(
          `/companies/${getCompanyId(editingCompany)}`,
          form
        );

        alert('แก้ไขข้อมูลบริษัทสำเร็จ');
      } else {
        await api.post('/companies', form);

        alert('เพิ่มบริษัทสำเร็จ');
      }

      setForm(emptyForm);
      setEditingCompany(null);
      setShowCompanyForm(false);

      await fetchCompanies();

    } catch (error) {
      console.error('Save company error:', error);
      alert(getErrorMessage(error));
    }
  };


  const handleDeleteCompany = async (company) => {
    const id = getCompanyId(company);

    if (!id) {
      alert('ไม่พบ ID ของบริษัท');
      return;
    }

    if (!window.confirm(
      `ต้องการลบบริษัท "${getCompanyName(company)}" หรือไม่?`
    )) {
      return;
    }

    try {
      await api.delete(`/companies/${id}`);

      alert('ลบบริษัทสำเร็จ');

      await fetchCompanies();

    } catch (error) {
      console.error('Delete company error:', error);
      alert(getErrorMessage(error));
    }
  };


  const startEditCompany = (company) => {
    setEditingCompany(company);

    setForm({
      company_name:
        company.company_name ||
        company.name ||
        '',
      address:
        company.address || '',
      phone:
        company.phone || '',
      industry:
        company.industry || '',
      allowance:
        company.allowance || '',
      accommodation:
        company.accommodation || '',
      shuttle:
        company.shuttle || '',
      welfare:
        company.welfare || ''
    });

    setShowCompanyForm(true);
  };


  const handleApplyClick = async (company) => {
    if (!profileData?.student_id) {
      alert(
        'ไม่พบรหัสนักศึกษาใน Profile\n' +
        'กรุณาสร้างหรือแก้ไข Profile ก่อนยื่นคำร้อง'
      );
      return;
    }

    await onApply(company);
  };


  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

        <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
          <Factory size={24} />
          รายชื่อสถานประกอบการ
        </h3>

        <div className="flex gap-2">

          {canManageCompanies && (
            <button
              onClick={() => {
                setEditingCompany(null);
                setForm(emptyForm);
                setShowCompanyForm(true);
              }}
              className="px-4 py-2 bg-[#800000] text-white rounded-xl text-xs font-black flex items-center gap-2"
            >
              <Plus size={15} />
              เพิ่มบริษัท
            </button>
          )}

          <input
            type="text"
            placeholder="ค้นหาบริษัท..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-52 px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#800000] font-bold"
          />

          <button
            onClick={() =>
              setShowFilterMenu(!showFilterMenu)
            }
            className="p-2.5 rounded-xl border bg-gray-50 text-gray-500"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>


      {showFilterMenu && (
        <div className="mb-5 p-3 bg-gray-50 rounded-2xl flex flex-wrap gap-2">
          {[
            ['All', 'ทั้งหมด'],
            ['Industry', 'โรงงาน / อุตสาหกรรม'],
            ['IT', 'IT / เทคโนโลยี'],
            ['Other', 'ทั่วไป']
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                setFilterIndustry(id);
                setShowFilterMenu(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-black ${
                filterIndustry === id
                  ? 'bg-[#800000] text-white'
                  : 'bg-white text-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}


      <div className="space-y-4">

        {loading ? (
          <div className="text-center py-10 text-gray-400 font-bold">
            กำลังดึงข้อมูล...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-10 text-gray-400 font-bold">
            ไม่พบข้อมูลสถานประกอบการ
          </div>
        ) : (
          filteredCompanies.map((company, index) => (

            <div
              key={company.id || company.company_id || index}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border border-gray-50 rounded-2xl hover:bg-red-50/50 transition-all"
            >

              <div
                className="flex items-center gap-4 flex-1 cursor-pointer"
                onClick={() =>
                  setSelectedCompany(company)
                }
              >

                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-[#800000]">
                  {index + 1}
                </div>

                <div>
                  <p className="font-black text-gray-800">
                    {getCompanyName(company)}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-1">

                    <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                      <MapPin size={12} />
                      {stringifyValue(company.address)}
                    </p>

                    {company.industry && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-bold">
                        {stringifyValue(company.industry)}
                      </span>
                    )}

                  </div>
                </div>
              </div>


              <div className="flex gap-2">

                {userRole === 'student' && (
                  <button
                    onClick={() =>
                      handleApplyClick(company)
                    }
                    className="px-4 py-2 bg-[#800000] hover:bg-black text-white rounded-xl text-xs font-black"
                  >
                    ยื่นคำร้อง
                  </button>
                )}

                {canManageCompanies && (
                  <>
                    <button
                      onClick={() =>
                        startEditCompany(company)
                      }
                      className="p-2 bg-blue-50 text-blue-600 rounded-xl"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteCompany(company)
                      }
                      className="p-2 bg-red-50 text-red-600 rounded-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}

                <ChevronRight
                  className="text-gray-300 mt-2 cursor-pointer"
                  onClick={() =>
                    setSelectedCompany(company)
                  }
                />

              </div>
            </div>
          ))
        )}
      </div>


      {/* COMPANY DETAIL */}

      {selectedCompany && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">

            <div className="bg-[#800000] p-8 text-white relative">

              <button
                onClick={() =>
                  setSelectedCompany(null)
                }
                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#800000]">
                  <Building2 size={32} />
                </div>

                <div>

                  <h4 className="text-xl md:text-2xl font-black">
                    {getCompanyName(selectedCompany)}
                  </h4>

                  <span className="inline-block mt-1 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                    {stringifyValue(
                      selectedCompany.industry
                    )}
                  </span>

                </div>
              </div>
            </div>


            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="p-5 bg-gray-50 rounded-3xl border flex gap-3">
                  <MapPin
                    className="text-[#800000]"
                    size={20}
                  />

                  <div>
                    <p className="text-[10px] font-black text-gray-400">
                      ที่ตั้ง
                    </p>

                    <p className="text-gray-800 font-bold">
                      {stringifyValue(
                        selectedCompany.address
                      )}
                    </p>
                  </div>
                </div>


                <div className="p-5 bg-gray-50 rounded-3xl border flex gap-3">

                  <Phone
                    className="text-[#800000]"
                    size={20}
                  />

                  <div>
                    <p className="text-[10px] font-black text-gray-400">
                      เบอร์โทรศัพท์
                    </p>

                    <p className="text-gray-800 font-black text-lg">
                      {stringifyValue(
                        selectedCompany.phone
                      )}
                    </p>
                  </div>

                </div>

              </div>


              <div className="p-6 bg-red-50/30 rounded-3xl border border-red-100">

                <p className="text-[10px] font-black text-[#800000] uppercase mb-3 flex items-center gap-2">
                  <Info size={14} />
                  รายละเอียดและสวัสดิการ
                </p>

                <div className="grid grid-cols-2 gap-4">

                  {[
                    ['เบี้ยเลี้ยง', selectedCompany.allowance],
                    ['ที่พัก', selectedCompany.accommodation],
                    ['รถรับส่ง', selectedCompany.shuttle],
                    ['สวัสดิการอื่นๆ', selectedCompany.welfare]
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] text-gray-400 font-bold">
                        {label}
                      </p>

                      <p className="text-sm font-bold text-gray-700">
                        {stringifyValue(value) || 'ไม่มี'}
                      </p>
                    </div>
                  ))}

                </div>
              </div>
            </div>


            <div className="p-6 border-t bg-gray-50/50 flex justify-end">

              <button
                onClick={() =>
                  setSelectedCompany(null)
                }
                className="px-10 py-3 bg-white text-gray-600 rounded-2xl font-black border"
              >
                ปิดหน้าต่าง
              </button>

            </div>
          </div>
        </div>
      )}


      {/* COMPANY FORM */}

      {showCompanyForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60">

          <form
            onSubmit={handleSubmitCompany}
            className="bg-white w-full max-w-2xl rounded-[35px] p-8 max-h-[90vh] overflow-y-auto"
          >

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-xl font-black text-[#800000]">
                {editingCompany
                  ? 'แก้ไขบริษัท'
                  : 'เพิ่มบริษัท'}
              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowCompanyForm(false)
                }
              >
                <X />
              </button>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {[
                ['company_name', 'ชื่อบริษัท'],
                ['address', 'ที่อยู่'],
                ['phone', 'เบอร์โทรศัพท์'],
                ['industry', 'ประเภทธุรกิจ'],
                ['allowance', 'เบี้ยเลี้ยง'],
                ['accommodation', 'ที่พัก'],
                ['shuttle', 'รถรับส่ง'],
                ['welfare', 'สวัสดิการอื่นๆ']
              ].map(([key, label]) => (

                <div key={key}>

                  <label className="text-xs font-black text-gray-500">
                    {label}
                  </label>

                  <input
                    value={form[key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [key]: e.target.value
                      })
                    }
                    className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl border outline-none focus:border-[#800000]"
                  />

                </div>

              ))}

            </div>


            <button
              type="submit"
              className="w-full mt-6 py-3 bg-[#800000] text-white rounded-2xl font-black flex justify-center items-center gap-2"
            >
              <Save size={17} />
              บันทึก
            </button>

          </form>
        </div>
      )}

    </div>
  );
};


// ============================================================
// APPLICATIONS
// ============================================================

const StudentApplications = ({
  profileData,
  onRefresh
}) => {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await api.get('/applications');

      const data = normalizeArray(
        response.data,
        ['applications', 'data', 'items']
      );

      setApplications(data);

    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchApplications();
  }, []);


  const myApplications = useMemo(() => {

    if (!profileData?.student_id) {
      return applications;
    }

    return applications.filter(
      (application) =>
        String(getStudentId(application)) ===
        String(profileData.student_id)
    );

  }, [applications, profileData]);


  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border">

      <div className="flex justify-between items-center mb-6">

        <h3 className="text-[#800000] font-black flex items-center gap-2">
          <FileSearch />
          คำร้องของฉัน
        </h3>

        <button
          onClick={async () => {
            await fetchApplications();
            onRefresh?.();
          }}
          className="p-2 bg-gray-50 rounded-xl"
        >
          <RefreshCw size={17} />
        </button>

      </div>


      {loading ? (
        <div className="text-center py-10 text-gray-400">
          กำลังโหลด...
        </div>
      ) : myApplications.length === 0 ? (
        <div className="text-center py-10 text-gray-400 font-bold">
          ยังไม่มีคำร้อง
        </div>
      ) : (

        <div className="space-y-4">

          {myApplications.map((application, index) => {

            const status =
              getApplicationStatus(application);

            return (
              <div
                key={
                  application.id ||
                  application.application_id ||
                  index
                }
                className="p-5 border rounded-2xl"
              >

                <div className="flex justify-between gap-4">

                  <div>

                    <p className="font-black text-gray-800">
                      {getApplicationCompanyName(application)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      รหัสนักศึกษา: {getStudentId(application)}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black border h-fit ${statusClass(status)}`}
                  >
                    {statusText(status)}
                  </span>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};


// ============================================================
// COORDINATOR APPLICATION MANAGEMENT
// ============================================================

const ApplicationManagement = () => {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchApplications = async () => {

    try {

      setLoading(true);

      const response =
        await api.get('/applications');

      console.log(
        'GET /applications:',
        response.data
      );

      const data = normalizeArray(
        response.data,
        [
          'applications',
          'data',
          'items'
        ]
      );

      setApplications(data);

    } catch (error) {

      console.error(
        'Fetch applications error:',
        error
      );

      alert(getErrorMessage(error));

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchApplications();
  }, []);


  const approveApplication = async (application) => {

    const id =
      application.id ||
      application.application_id;

    if (!id) {
      alert('ไม่พบ application_id');
      return;
    }

    try {

      await api.put(
        `/applications/${id}/approve`
      );

      alert('อนุมัติคำร้องสำเร็จ');

      await fetchApplications();

    } catch (error) {

      console.error(error);

      alert(getErrorMessage(error));

    }
  };


  const rejectApplication = async (application) => {

    const id =
      application.id ||
      application.application_id;

    if (!id) {
      alert('ไม่พบ application_id');
      return;
    }

    try {

      await api.put(
        `/applications/${id}/reject`
      );

      alert('ปฏิเสธคำร้องสำเร็จ');

      await fetchApplications();

    } catch (error) {

      console.error(error);

      alert(getErrorMessage(error));

    }
  };


  const approved =
    applications.filter((item) => {
      const status =
        String(
          getApplicationStatus(item)
        ).toLowerCase();

      return (
        status.includes('approve') ||
        status.includes('อนุมัติ')
      );
    }).length;


  const waiting =
    applications.filter((item) => {
      const status =
        String(
          getApplicationStatus(item)
        ).toLowerCase();

      return (
        status.includes('wait') ||
        status.includes('pending') ||
        status.includes('รอ')
      );
    }).length;


  const rejected =
    applications.filter((item) => {
      const status =
        String(
          getApplicationStatus(item)
        ).toLowerCase();

      return (
        status.includes('reject') ||
        status.includes('ปฏิเสธ')
      );
    }).length;


  return (
    <div className="space-y-6">

      {/* STATISTICS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-3xl border border-emerald-100">
          <p className="text-xs font-black text-emerald-600">
            อนุมัติแล้ว
          </p>

          <h4 className="text-3xl font-black text-emerald-700">
            {approved}
          </h4>
        </div>


        <div className="bg-white p-5 rounded-3xl border border-amber-100">
          <p className="text-xs font-black text-amber-600">
            รอตรวจสอบ
          </p>

          <h4 className="text-3xl font-black text-amber-700">
            {waiting}
          </h4>
        </div>


        <div className="bg-white p-5 rounded-3xl border border-red-100">
          <p className="text-xs font-black text-red-600">
            ปฏิเสธ
          </p>

          <h4 className="text-3xl font-black text-red-700">
            {rejected}
          </h4>
        </div>

      </div>


      {/* TABLE */}

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border">

        <div className="flex justify-between items-center mb-6">

          <h3 className="text-[#800000] font-black flex items-center gap-2">
            <ClipboardCheck />
            จัดการและอนุมัติคำร้องเลือกสถานประกอบการ
          </h3>

          <button
            onClick={fetchApplications}
            className="p-2 bg-gray-50 rounded-xl"
          >
            <RefreshCw size={17} />
          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>

              <tr className="border-b text-xs font-black text-gray-400">

                <th className="pb-3 pr-4">
                  รหัสนักศึกษา
                </th>

                <th className="pb-3 pr-4">
                  ชื่อ
                </th>

                <th className="pb-3 pr-4">
                  สาขา
                </th>

                <th className="pb-3 pr-4">
                  บริษัท
                </th>

                <th className="pb-3 pr-4 text-center">
                  สถานะ
                </th>

                <th className="pb-3 text-right">
                  การจัดการ
                </th>

              </tr>

            </thead>


            <tbody className="text-sm font-bold">

              {loading ? (

                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center text-gray-400"
                  >
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>

              ) : applications.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center text-gray-400"
                  >
                    ไม่พบคำร้อง
                  </td>
                </tr>

              ) : (

                applications.map(
                  (application, index) => {

                    const status =
                      getApplicationStatus(
                        application
                      );

                    return (

                      <tr
                        key={
                          application.id ||
                          application.application_id ||
                          index
                        }
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >

                        {/* STUDENT ID */}

                        <td className="py-4 pr-4 font-mono text-gray-500">
                          {stringifyValue(
                            getStudentId(application)
                          )}
                        </td>


                        {/* NAME */}

                        <td className="py-4 pr-4 text-gray-800">
                          {getStudentName(application)}
                        </td>


                        {/* MAJOR */}

                        <td className="py-4 pr-4">

                          <span className="bg-gray-100 px-2 py-1 rounded-lg text-xs">
                            {stringifyValue(
                              getStudentMajor(application)
                            )}
                          </span>

                        </td>


                        {/* COMPANY */}

                        <td className="py-4 pr-4 text-[#800000] font-black">

                          {getApplicationCompanyName(
                            application
                          )}

                        </td>


                        {/* STATUS */}

                        <td className="py-4 pr-4 text-center">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black border ${statusClass(status)}`}
                          >
                            {statusText(status)}
                          </span>

                        </td>


                        {/* ACTION */}

                        <td className="py-4 text-right">

                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() =>
                                approveApplication(
                                  application
                                )
                              }
                              className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black"
                            >
                              อนุมัติ
                            </button>

                            <button
                              onClick={() =>
                                rejectApplication(
                                  application
                                )
                              }
                              className="px-3 py-2 bg-red-600 text-white rounded-xl text-xs font-black"
                            >
                              ปฏิเสธ
                            </button>

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


// ============================================================
// STUDENT PROFILE
// ============================================================

const StudentProfile = ({
  profileData,
  onSaved
}) => {

  const [form, setForm] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    faculty: '',
    major: '',
    semester: '',
    phone: '',
    address: ''
  });

  const [saving, setSaving] = useState(false);


  useEffect(() => {

    if (!profileData) return;

    setForm({
      student_id:
        profileData.student_id || '',
      first_name:
        profileData.first_name || '',
      last_name:
        profileData.last_name || '',
      faculty:
        profileData.faculty || '',
      major:
        profileData.major || '',
      semester:
        profileData.semester || '',
      phone:
        profileData.phone || '',
      address:
        profileData.address || ''
    });

  }, [profileData]);


  const handleSave = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);

      if (profileData) {

        await api.put(
          '/student/me',
          form
        );

        alert(
          'แก้ไข Profile สำเร็จ'
        );

      } else {

        await api.post(
          '/student/me',
          form
        );

        alert(
          'สร้าง Profile สำเร็จ'
        );
      }

      await onSaved?.();

    } catch (error) {

      console.error(error);

      alert(getErrorMessage(error));

    } finally {
      setSaving(false);
    }
  };


  return (
    <form
      onSubmit={handleSave}
      className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border"
    >

      <h3 className="text-[#800000] font-black text-lg flex gap-2 items-center mb-6">
        <UserCog />
        Profile นักศึกษา
      </h3>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {[
          ['student_id', 'รหัสนักศึกษา'],
          ['first_name', 'ชื่อ'],
          ['last_name', 'นามสกุล'],
          ['faculty', 'คณะ'],
          ['major', 'สาขา'],
          ['semester', 'ภาคเรียน'],
          ['phone', 'เบอร์โทรศัพท์'],
          ['address', 'ที่อยู่']
        ].map(([key, label]) => (

          <div key={key}>

            <label className="text-xs font-black text-gray-500">
              {label}
            </label>

            <input
              value={form[key]}
              disabled={
                key === 'student_id' &&
                Boolean(profileData)
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]: e.target.value
                })
              }
              className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl border outline-none focus:border-[#800000]"
            />

          </div>

        ))}

      </div>


      <button
        disabled={saving}
        className="mt-6 px-6 py-3 bg-[#800000] text-white rounded-xl font-black flex gap-2 items-center"
      >
        <Save size={17} />
        {saving ? 'กำลังบันทึก...' : 'บันทึก Profile'}
      </button>

    </form>
  );
};


// ============================================================
// TEACHER MANAGEMENT
// ============================================================

const TeacherManagement = ({
  activeTab
}) => {

  const [students, setStudents] = useState([]);
  const [supervisions, setSupervisions] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(false);


  useEffect(() => {

    const load = async () => {

      try {

        setLoading(true);

        if (
          activeTab === 'my_students'
        ) {

          const response =
            await api.get(
              '/teacher/students'
            );

          setStudents(
            normalizeArray(
              response.data,
              ['students', 'data', 'items']
            )
          );
        }


        if (
          activeTab === 'supervise'
        ) {

          const response =
            await api.get(
              '/teacher/supervisions'
            );

          setSupervisions(
            normalizeArray(
              response.data,
              ['supervisions', 'data', 'items']
            )
          );
        }


        if (
          activeTab === 'overview'
        ) {

          const response =
            await api.get(
              '/teacher/dashboard'
            );

          setDashboard(response.data);
        }

      } catch (error) {

        console.error(error);

        alert(getErrorMessage(error));

      } finally {
        setLoading(false);
      }

    };

    load();

  }, [activeTab]);


  if (loading) {

    return (
      <div className="bg-white p-10 rounded-3xl text-center text-gray-400">
        กำลังโหลดข้อมูล...
      </div>
    );
  }


  if (activeTab === 'my_students') {

    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl border">

        <h3 className="text-[#800000] font-black text-lg mb-6 flex gap-2">
          <Users />
          นักศึกษาในความดูแล
        </h3>


        <div className="grid md:grid-cols-2 gap-4">

          {students.length === 0 ? (

            <p className="text-gray-400">
              ไม่พบข้อมูลนักศึกษา
            </p>

          ) : (

            students.map((student, index) => (

              <div
                key={
                  student.student_id ||
                  student.id ||
                  index
                }
                className="p-5 border rounded-2xl"
              >

                <p className="font-black">
                  {[
                    student.first_name,
                    student.last_name
                  ]
                    .filter(Boolean)
                    .join(' ') ||
                    student.name ||
                    '-'}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  รหัส: {student.student_id || '-'}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  สาขา: {student.major || '-'}
                </p>

              </div>

            ))
          )}

        </div>
      </div>
    );
  }


  if (activeTab === 'supervise') {

    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl border">

        <h3 className="text-[#800000] font-black text-lg mb-6 flex gap-2">
          <ClipboardCheck />
          Supervision
        </h3>


        {supervisions.length === 0 ? (

          <p className="text-gray-400">
            ไม่พบข้อมูล Supervision
          </p>

        ) : (

          <div className="space-y-4">

            {supervisions.map(
              (item, index) => (

                <div
                  key={
                    item.id ||
                    item.supervision_id ||
                    index
                  }
                  className="p-5 bg-gray-50 rounded-2xl"
                >

                  <p className="font-black">
                    {stringifyValue(
                      item.student_name ||
                      item.student
                    )}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    {stringifyValue(
                      item.note ||
                      item.description ||
                      item.result
                    )}
                  </p>

                </div>
              )
            )}

          </div>
        )}

      </div>
    );
  }


  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border">

      <h3 className="text-[#800000] font-black text-lg mb-6">
        Teacher Dashboard
      </h3>

      <pre className="bg-gray-50 p-5 rounded-2xl overflow-auto text-xs">
        {JSON.stringify(
          dashboard,
          null,
          2
        )}
      </pre>

    </div>
  );
};


// ============================================================
// ADMIN DASHBOARD
// ============================================================

const AdminManagement = ({
  activeTab,
  onRefreshProfile
}) => {

  const [dashboard, setDashboard] =
    useState(null);

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  const load = async () => {

    try {

      setLoading(true);

      if (
        activeTab === 'overview'
      ) {

        const response =
          await api.get(
            '/admin/dashboard'
          );

        setDashboard(response.data);
      }


      if (
        activeTab === 'all_students'
      ) {

        const response =
          await api.get('/students');

        setStudents(
          normalizeArray(
            response.data,
            ['students', 'data', 'items']
          )
        );
      }

    } catch (error) {

      console.error(error);

      alert(getErrorMessage(error));

    } finally {
      setLoading(false);
    }

  };


  useEffect(() => {
    load();
  }, [activeTab]);


  const deleteStudent = async (student) => {

    const id =
      student.student_id ||
      student.id;

    if (!id) {
      alert('ไม่พบ student_id');
      return;
    }

    if (
      !window.confirm(
        `ต้องการลบนักศึกษา ${id} หรือไม่?`
      )
    ) {
      return;
    }

    try {

      await api.delete(
        `/students/${id}`
      );

      alert('ลบนักศึกษาสำเร็จ');

      await load();

    } catch (error) {

      console.error(error);

      alert(getErrorMessage(error));

    }
  };


  if (loading) {

    return (
      <div className="bg-white p-10 rounded-3xl text-center text-gray-400">
        กำลังโหลด...
      </div>
    );
  }


  if (
    activeTab === 'all_students'
  ) {

    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl border">

        <h3 className="text-[#800000] font-black text-lg mb-6 flex gap-2">
          <Users />
          นักศึกษาทั้งหมด
        </h3>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-xs text-gray-400 font-black">

                <th className="text-left py-3">
                  รหัส
                </th>

                <th className="text-left py-3">
                  ชื่อ
                </th>

                <th className="text-left py-3">
                  สาขา
                </th>

                <th className="text-right py-3">
                  จัดการ
                </th>

              </tr>

            </thead>


            <tbody>

              {students.map(
                (student, index) => (

                  <tr
                    key={
                      student.student_id ||
                      student.id ||
                      index
                    }
                    className="border-b border-gray-50"
                  >

                    <td className="py-4">
                      {student.student_id ||
                        student.id ||
                        '-'}
                    </td>

                    <td className="py-4 font-black">

                      {[
                        student.first_name,
                        student.last_name
                      ]
                        .filter(Boolean)
                        .join(' ') ||
                        student.name ||
                        '-'}

                    </td>

                    <td className="py-4">
                      {student.major || '-'}
                    </td>

                    <td className="py-4 text-right">

                      <button
                        onClick={() =>
                          deleteStudent(student)
                        }
                        className="p-2 bg-red-50 text-red-600 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>
      </div>
    );
  }


  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border">

      <h3 className="text-[#800000] font-black text-lg mb-6">
        Admin Dashboard
      </h3>

      <pre className="bg-gray-50 p-5 rounded-2xl overflow-auto text-xs">
        {JSON.stringify(
          dashboard,
          null,
          2
        )}
      </pre>

    </div>
  );
};


// ============================================================
// LOGIN
// ============================================================

const LoginPage = ({
  onLogin
}) => {

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setLoading(true);

      const response =
        await api.post(
          '/login',
          {
            username: String(username),
            password: String(password)
          }
        );

      console.log(
        'Login response:',
        response.data
      );


      const token =
        typeof response.data === 'string'
          ? response.data
          : response.data?.access_token;


      const backendRole =
        response.data?.role;


      const loggedInUsername =
        response.data?.username ||
        username;


      const frontendRoleMap = {
        student: 'student',
        teacher: 'advisor',
        admin: 'coordinator'
      };


      const frontendRole =
        frontendRoleMap[
          backendRole
        ];


      if (!token) {

        alert(
          'เข้าสู่ระบบสำเร็จ แต่ไม่พบ Token'
        );

        return;
      }


      if (!frontendRole) {

        alert(
          `ไม่พบสิทธิ์ที่ระบบรองรับ: ${backendRole}`
        );

        return;
      }


      localStorage.setItem(
        'token',
        token
      );

      localStorage.setItem(
        'userRole',
        frontendRole
      );

      localStorage.setItem(
        'backendRole',
        backendRole
      );


      onLogin(
        frontendRole,
        loggedInUsername
      );

    } catch (error) {

      console.error(
        'Login error:',
        error
      );

      alert(
        getErrorMessage(error)
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">

      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl w-full max-w-lg border text-center">

        <div className="w-20 h-20 mx-auto mb-4">

          <RobotLogo className="w-20 h-20" />

        </div>


        <h1 className="text-xl font-black text-gray-800 mb-6">
          เข้าสู่ระบบระบบสหกิจศึกษา
        </h1>


        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-left"
        >

          <div>

            <label className="text-xs font-black text-gray-400">
              ชื่อบัญชีผู้ใช้งาน
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full mt-2 px-6 py-4 bg-gray-50 border rounded-2xl outline-none focus:border-[#800000]"
              required
            />

          </div>


          <div>

            <label className="text-xs font-black text-gray-400">
              รหัสผ่าน
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full mt-2 px-6 py-4 bg-gray-50 border rounded-2xl outline-none focus:border-[#800000]"
              required
            />

          </div>


          <button
            disabled={loading}
            className="w-full bg-[#800000] text-white py-4 rounded-2xl font-black disabled:opacity-50"
          >
            {loading
              ? 'กำลังเข้าสู่ระบบ...'
              : 'เข้าสู่ระบบ'}
          </button>

        </form>

      </div>
    </div>
  );
};


// ============================================================
// MAIN APP
// ============================================================

const MainAppContainer = () => {

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      Boolean(
        localStorage.getItem('token')
      )
    );


  const [userRole, setUserRole] =
    useState(
      localStorage.getItem(
        'userRole'
      ) || 'student'
    );


  const [activeTab, setActiveTab] =
    useState('overview');


  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);


  const [profileData, setProfileData] =
    useState(null);


  const [fetchingUser, setFetchingUser] =
    useState(false);


  // ============================================================
  // FETCH PROFILE
  // ============================================================

  const fetchProfile = async () => {

    if (!isLoggedIn) return;

    if (
      userRole === 'coordinator'
    ) {
      return;
    }


    try {

      setFetchingUser(true);

      const endpoint =
        userRole === 'advisor'
          ? '/teacher/me'
          : '/student/me';


      const response =
        await api.get(endpoint);


      console.log(
        `${endpoint} response:`,
        response.data
      );


      let data =
        response.data;


      if (Array.isArray(data)) {
        data = data[0] || null;
      }


      if (data?.user) {

        data =
          Array.isArray(data.user)
            ? data.user[0]
            : data.user;
      }


      setProfileData(data);

    } catch (error) {

      console.error(
        'Profile error:',
        error
      );


      if (
        error.response?.status === 401
      ) {
        handleLogout();
        return;
      }


      // Profile ยังไม่มี
      if (
        error.response?.status === 404
      ) {
        setProfileData(null);
      }

    } finally {
      setFetchingUser(false);
    }
  };


  useEffect(() => {

    fetchProfile();

  }, [
    isLoggedIn,
    userRole
  ]);


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {

    localStorage.clear();

    setIsLoggedIn(false);
    setProfileData(null);
    setUserRole('student');
    setActiveTab('overview');
  };


  // ============================================================
  // LOGIN SUCCESS
  // ============================================================

  const handleLoginSuccess = (
    role,
    username
  ) => {

    setUserRole(role);

    setProfileData(
      username
        ? { username }
        : null
    );

    setIsLoggedIn(true);
  };


  // ============================================================
  // APPLY COMPANY
  // สำคัญ: ส่ง student_id + company_id
  // ============================================================

  const handleApplyCompany = async (
    company
  ) => {

    try {

      if (
        !profileData?.student_id
      ) {

        alert(
          'ไม่พบรหัสนักศึกษา\n' +
          'กรุณาสร้าง Profile นักศึกษาก่อน'
        );

        return;
      }


      const companyId =
        getCompanyId(company);


      if (!companyId) {

        alert(
          'ไม่พบ ID ของบริษัท'
        );

        return;
      }


      const payload = {
        student_id:
          profileData.student_id,

        company_id:
          Number(companyId)
      };


      console.log(
        'POST /apply payload:',
        payload
      );


      const response =
        await api.post(
          '/apply',
          payload
        );


      console.log(
        'POST /apply response:',
        response.data
      );


      alert(
        'ยื่นคำร้องเลือกสถานประกอบการสำเร็จ'
      );


      setActiveTab('request');

    } catch (error) {

      console.error(
        'Apply error:',
        error
      );

      console.error(
        'Apply response:',
        error.response?.data
      );


      alert(
        getErrorMessage(error)
      );
    }
  };


  // ============================================================
  // MENU
  // ============================================================

  const getMenuItems = () => {

    if (
      userRole === 'student'
    ) {

      return [
        {
          id: 'overview',
          name: 'หน้าหลัก',
          icon: <BarChart3 size={20} />
        },
        {
          id: 'company',
          name: 'สถานประกอบการ',
          icon: <Factory size={20} />
        },
        {
          id: 'request',
          name: 'คำร้องของฉัน',
          icon: <FileSearch size={20} />
        },
        {
          id: 'profile',
          name: 'Profile',
          icon: <User size={20} />
        }
      ];

    }


    if (
      userRole === 'coordinator'
    ) {

      return [
        {
          id: 'overview',
          name: 'Dashboard',
          icon: <BarChart3 size={20} />
        },
        {
          id: 'company',
          name: 'จัดการบริษัท',
          icon: <Factory size={20} />
        },
        {
          id: 'manage_requests',
          name: 'อนุมัติคำร้อง',
          icon: <ClipboardCheck size={20} />
        },
        {
          id: 'all_students',
          name: 'นักศึกษาทั้งหมด',
          icon: <Users size={20} />
        }
      ];

    }


    return [
      {
        id: 'overview',
        name: 'Dashboard',
        icon: <BarChart3 size={20} />
      },
      {
        id: 'company',
        name: 'สถานประกอบการ',
        icon: <Factory size={20} />
      },
      {
        id: 'supervise',
        name: 'Supervision',
        icon: <ClipboardCheck size={20} />
      },
      {
        id: 'my_students',
        name: 'นักศึกษาในความดูแล',
        icon: <Users size={20} />
      }
    ];
  };


  if (!isLoggedIn) {

    return (
      <LoginPage
        onLogin={
          handleLoginSuccess
        }
      />
    );
  }


  const displayId =
    profileData?.student_id ||
    profileData?.staff_id ||
    profileData?.username ||
    '-';


  const displayFullName =
    profileData?.first_name &&
    profileData?.last_name
      ? `${profileData.first_name} ${profileData.last_name}`
      : fetchingUser
        ? 'กำลังโหลด...'
        : profileData?.username ||
          'ผู้ใช้งานระบบ';


  return (

    <div className="flex h-screen w-full bg-[#f1f5f9] font-['Sarabun'] antialiased overflow-hidden">

      {/* SIDEBAR */}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col shrink-0 ${
          isSidebarOpen
            ? 'w-72 translate-x-0'
            : 'w-72 -translate-x-full md:translate-x-0 md:w-24'
        }`}
      >

        <div className="p-6 flex items-center justify-center border-b border-white/10 h-24">

          <div className="flex items-center gap-3">

            <RobotLogo className="w-12 h-12" />

            {isSidebarOpen && (
              <span className="font-black text-sm">
                CO-OP SYSTEM
              </span>
            )}

          </div>


          {isSidebarOpen && (
            <button
              onClick={() =>
                setIsSidebarOpen(false)
              }
              className="absolute right-4 md:hidden"
            >
              <X />
            </button>
          )}

        </div>


        <nav className="flex-1 px-4 mt-8 space-y-2">

          {getMenuItems().map(
            (item) => (

              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(
                    item.id
                  );
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center w-full p-4 rounded-2xl ${
                  activeTab === item.id
                    ? 'bg-white text-[#800000]'
                    : 'text-red-100/70 hover:bg-white/5'
                }`}
              >

                {item.icon}

                {isSidebarOpen && (
                  <span className="ml-4 text-xs font-black">
                    {item.name}
                  </span>
                )}

              </button>

            )
          )}

        </nav>


        <button
          onClick={handleLogout}
          className="p-8 flex items-center border-t border-white/5"
        >

          <LogOut size={20} />

          {isSidebarOpen && (
            <span className="ml-4 font-black text-xs">
              LOGOUT
            </span>
          )}

        </button>

      </aside>


      {/* MAIN */}

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}

        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shrink-0">

          <div className="flex items-center gap-4">

            {!isSidebarOpen && (

              <button
                onClick={() =>
                  setIsSidebarOpen(true)
                }
                className="p-2 bg-gray-50 rounded-xl"
              >
                <Menu size={20} />
              </button>

            )}

            <h2 className="font-black text-gray-800">
              {activeTab === 'overview'
                ? 'Dashboard Overview'
                : activeTab}
            </h2>

          </div>


          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border">

            <div className="text-right hidden sm:block">

              <p className="text-xs font-black text-gray-700">
                {userRole === 'student'
                  ? `ST-ID: ${displayId}`
                  : `STAFF-ID: ${displayId}`}
              </p>

              <span className="text-[9px] font-black text-red-800">
                {userRole === 'student'
                  ? 'นักศึกษา'
                  : userRole === 'coordinator'
                    ? 'ผู้ประสานงาน'
                    : 'อาจารย์นิเทศก์'}
              </span>

            </div>


            <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white">
              <User size={20} />
            </div>

          </div>

        </header>


        {/* CONTENT */}

        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">

          <div className="max-w-6xl mx-auto space-y-6">


            {/* OVERVIEW */}

            {activeTab === 'overview' && (

              <>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  <div className="lg:col-span-2 bg-gradient-to-br from-[#800000] to-red-950 p-8 rounded-[35px] text-white">

                    <h3 className="text-2xl font-black">
                      สวัสดีคุณ {displayFullName}!
                    </h3>

                    <p className="opacity-80 text-sm mt-2">
                      ยินดีต้อนรับเข้าสู่ระบบจัดการสหกิจศึกษา
                    </p>

                  </div>


                  <div className="bg-white p-6 rounded-[35px] border">

                    <span className="text-[10px] bg-red-50 text-[#800000] px-2 py-1 rounded">
                      บัญชีผู้ใช้งาน
                    </span>

                    <div className="flex gap-3 mt-4">

                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <GraduationCap />
                      </div>

                      <div>

                        <p className="font-black text-sm">
                          {displayFullName}
                        </p>

                        <p className="text-xs text-gray-400">
                          สิทธิ์: {userRole}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>


                <div className="bg-white p-6 md:p-8 rounded-[35px] border">

                  <h4 className="font-black mb-6 flex gap-2">
                    <BarChart3
                      className="text-[#800000]"
                    />
                    ภาพรวมระบบ
                  </h4>


                  <div className="grid md:grid-cols-3 gap-4">

                    <div className="p-5 bg-emerald-50 rounded-2xl">

                      <p className="text-xs text-emerald-600 font-black">
                        อนุมัติ
                      </p>

                      <p className="text-3xl text-emerald-700 font-black">
                        {userRole === 'student'
                          ? '0'
                          : '-'}
                      </p>

                    </div>


                    <div className="p-5 bg-amber-50 rounded-2xl">

                      <p className="text-xs text-amber-600 font-black">
                        รอตรวจสอบ
                      </p>

                      <p className="text-3xl text-amber-700 font-black">
                        {userRole === 'student'
                          ? '0'
                          : '-'}
                      </p>

                    </div>


                    <div className="p-5 bg-red-50 rounded-2xl">

                      <p className="text-xs text-red-600 font-black">
                        ปฏิเสธ
                      </p>

                      <p className="text-3xl text-red-700 font-black">
                        {userRole === 'student'
                          ? '0'
                          : '-'}
                      </p>

                    </div>

                  </div>

                </div>

              </>

            )}


            {/* COMPANY */}

            {activeTab === 'company' && (

              <CompanyManagement
                userRole={userRole}
                profileData={profileData}
                onApply={
                  handleApplyCompany
                }
              />

            )}


            {/* STUDENT REQUEST */}

            {userRole === 'student' &&
              activeTab === 'request' && (

                <StudentApplications
                  profileData={profileData}
                  onRefresh={
                    fetchProfile
                  }
                />

              )}


            {/* STUDENT PROFILE */}

            {userRole === 'student' &&
              activeTab === 'profile' && (

                <StudentProfile
                  profileData={
                    profileData
                  }
                  onSaved={
                    fetchProfile
                  }
                />

              )}


            {/* COORDINATOR */}

            {userRole === 'coordinator' &&
              activeTab === 'manage_requests' && (

                <ApplicationManagement />

              )}


            {userRole === 'coordinator' &&
              activeTab === 'all_students' && (

                <AdminManagement
                  activeTab={
                    activeTab
                  }
                />

              )}


            {/* ADVISOR */}

            {userRole === 'advisor' && (

              <TeacherManagement
                activeTab={
                  activeTab
                }
              />

            )}

          </div>

        </section>

      </main>


      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700;800&display=swap');

            body {
              font-family: 'Sarabun', sans-serif;
            }
          `
        }}
      />

    </div>
  );
};


export default MainAppContainer;
