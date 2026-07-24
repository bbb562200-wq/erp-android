import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cloud, 
  Database, 
  Key, 
  User, 
  Lock, 
  RefreshCw, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  LogIn, 
  UserPlus,
  ShieldAlert,
  HardDrive
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useERP } from '../../context/ERPContext';
import { UserRole } from '../../types';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  const { 
    language, 
    user, 
    syncStatus, 
    auditLogs, 
    login, 
    logout, 
    syncToCloud, 
    isPinLocked, 
    setIsPinLocked,
    addAuditLog 
  } = useERP();

  const [activeTab, setActiveTab] = useState<'status' | 'auth' | 'roles' | 'logs'>('status');
  
  // Auth Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');

  // PIN Form
  const [pinInput, setPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (!email.trim() || !password.trim()) {
        setAuthError(language === 'ar' ? 'يرجى إدخال البريد وكلمة المرور' : 'Please enter email and password');
        return;
      }
      await login(email, password, isRegisterMode ? displayName || 'المستخدم' : undefined, selectedRole);
      addAuditLog(isRegisterMode ? 'تسجيل حساب جديد' : 'تسجيل دخول', 'الأمان', `المستخدم: ${email}`);
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (err: any) {
      setAuthError(err.message || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Authentication failed'));
    }
  };

  const handleTogglePin = () => {
    if (isPinLocked) {
      if (pinInput === '1234' || pinInput.length >= 4) {
        setIsPinLocked(false);
        setPinInput('');
        setPinMessage(language === 'ar' ? 'تم إلغاء قفل الحماية بنجاح' : 'Security lock disabled');
      } else {
        setPinMessage(language === 'ar' ? 'رمز PIN غير صحيح (الافتراضي: 1234)' : 'Incorrect PIN (Default: 1234)');
      }
    } else {
      setIsPinLocked(true);
      setPinMessage(language === 'ar' ? 'تم تفعيل قفل الحماية والرموز' : 'Security lock enabled');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-purple-400">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{language === 'ar' ? 'مركز الأمان وقواعد البيانات (Cloud & Local DB)' : 'Security & Database Center'}</span>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'status' 
                ? 'border-purple-500 text-purple-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>{language === 'ar' ? 'حالة السحابة والمحلي' : 'DB & Cloud Status'}</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'auth' 
                ? 'border-purple-500 text-purple-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{language === 'ar' ? 'الهوية والحساب' : 'Auth & Account'}</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'roles' 
                ? 'border-purple-500 text-purple-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>{language === 'ar' ? 'الصلاحيات والقفل' : 'Roles & Locks'}</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'logs' 
                ? 'border-purple-500 text-purple-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{language === 'ar' ? 'سجل الأمان Audit' : 'Audit Logs'}</span>
          </button>
        </div>

        {/* Tab 1: DB & Cloud Sync Status */}
        {activeTab === 'status' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Local Storage Database */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs sm:text-sm">
                    <HardDrive className="w-4 h-4" />
                    <span>{language === 'ar' ? 'قاعدة البيانات المحلية Local' : 'Local Indexed DB'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {language === 'ar' ? 'نشط وسريع' : 'Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'ar' 
                    ? 'يتم تخزين جميع البيانات فورياً محلياً للعمل بدون إنترنت وبسرعة فائقة (Offline First).' 
                    : 'Instant local persistence ensures 100% availability even without internet.'}
                </p>
              </div>

              {/* Firebase Cloud Database */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                    <Cloud className="w-4 h-4" />
                    <span>{language === 'ar' ? 'قاعدة البيانات السحابية Cloud' : 'Firebase Cloud Sync'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    syncStatus === 'synced'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : syncStatus === 'syncing'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    {syncStatus === 'synced' ? (language === 'ar' ? 'متزامن' : 'Synced') :
                     syncStatus === 'syncing' ? (language === 'ar' ? 'جاري المزامنة...' : 'Syncing...') :
                     (language === 'ar' ? 'غير متصل' : 'Offline')}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'ar' 
                    ? 'ربط مباشر مع Firebase Firestore ومزامنة البيانات بأمان مشفر عبر البروتوكولات الأمنيّة.' 
                    : 'Direct cloud sync with Firebase Firestore protected by strict security rules.'}
                </p>
              </div>
            </div>

            {/* Manual Sync Trigger */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-purple-300">
                  {language === 'ar' ? 'مزامنة فورية الآن مع السحابة' : 'Force Instant Cloud Sync'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {language === 'ar' ? 'رفع أحدث النسخ المحلية إلى السحابة ومزامنة التغييرات' : 'Sync local changes to Firestore database'}
                </p>
              </div>
              <button
                onClick={() => syncToCloud()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-950/50 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'مزامنة الآن' : 'Sync Now'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: User Auth & Account */}
        {activeTab === 'auth' && (
          <div className="space-y-4">
            {user ? (
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{user.displayName}</h3>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                    {user.role}
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => logout()}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-xs font-bold text-slate-300">
                    {isRegisterMode 
                      ? (language === 'ar' ? 'إنشاء حساب أمان جديد' : 'Register New Account')
                      : (language === 'ar' ? 'تسجيل الدخول للنظام' : 'Sign In to ERP')}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="text-xs text-purple-400 hover:underline font-semibold"
                  >
                    {isRegisterMode 
                      ? (language === 'ar' ? 'لديك حساب بالفعل؟ دخول' : 'Already have an account? Login')
                      : (language === 'ar' ? 'إنشاء حساب جديد' : 'Register now')}
                  </button>
                </div>

                {authError && (
                  <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {isRegisterMode && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: أحمد بلقاسم' : 'John Doe'}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-slate-400 mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@company.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {isRegisterMode && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{language === 'ar' ? 'مستوى الصلاحيات' : 'Role Level'}</label>
                    <select
                      value={selectedRole}
                      onChange={e => setSelectedRole(e.target.value as UserRole)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                    >
                      <option value="admin">{language === 'ar' ? 'مدير نظام كامل (Admin)' : 'Admin'}</option>
                      <option value="manager">{language === 'ar' ? 'مدير قسم (Manager)' : 'Manager'}</option>
                      <option value="staff">{language === 'ar' ? 'موظف تنفيذ (Staff)' : 'Staff'}</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  <span>{isRegisterMode ? (language === 'ar' ? 'إنشاء وتفعيل الحساب' : 'Register Account') : (language === 'ar' ? 'دخول النظام' : 'Sign In')}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Security Roles & Lock */}
        {activeTab === 'roles' && (
          <div className="space-y-4">
            {/* PIN Lock Settings */}
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {language === 'ar' ? 'قفل الحماية برمز PIN' : 'Security PIN Protection'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isPinLocked 
                        ? (language === 'ar' ? 'القفل مفعل حالياً' : 'PIN Lock Active')
                        : (language === 'ar' ? 'القفل معطل' : 'PIN Lock Disabled')}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  isPinLocked 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-slate-700 text-slate-300 border-slate-600'
                }`}>
                  {isPinLocked ? (language === 'ar' ? 'مفعل' : 'Locked') : (language === 'ar' ? 'معطل' : 'Unlocked')}
                </span>
              </div>

              {pinMessage && (
                <p className="text-xs text-amber-300 font-medium">{pinMessage}</p>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder={language === 'ar' ? 'رمز PIN (افتراضي: 1234)' : 'PIN (Default: 1234)'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleTogglePin}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition"
                >
                  {isPinLocked ? (language === 'ar' ? 'إلغاء القفل' : 'Unlock') : (language === 'ar' ? 'تفعيل القفل' : 'Lock')}
                </button>
              </div>
            </div>

            {/* Matrix Permissions overview */}
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-slate-200">
                {language === 'ar' ? 'مصفوفة صلاحيات الوصول RBAC' : 'RBAC Access Matrix'}
              </h4>
              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between p-2 rounded bg-slate-900/60">
                  <span className="font-semibold text-purple-400">Admin</span>
                  <span>{language === 'ar' ? 'صلاحيات كاملة + تعديل المخزون والمالية والموظفين' : 'Full system access & security edits'}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900/60">
                  <span className="font-semibold text-indigo-400">Manager</span>
                  <span>{language === 'ar' ? 'إدارة المبيعات والمستودعات والتقارير' : 'Sales, inventory & reports'}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900/60">
                  <span className="font-semibold text-slate-400">Staff</span>
                  <span>{language === 'ar' ? 'عرض السجلات وإدخال الفواتير فقط' : 'View records & create invoices'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'logs' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300">
                {language === 'ar' ? 'سجل العمليات والأمان الفوري' : 'Security Audit Trail'}
              </h4>
              <span className="text-[11px] text-slate-400">{auditLogs.length} {language === 'ar' ? 'سجل' : 'entries'}</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">{language === 'ar' ? 'لا توجد سجلات أمان حالياً' : 'No security logs recorded.'}</p>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="font-bold text-purple-400">{log.action} • {log.module}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-slate-200 font-medium">{log.details}</p>
                    <p className="text-[10px] text-slate-400">{log.userEmail}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
