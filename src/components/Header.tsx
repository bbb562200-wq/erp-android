import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  DollarSign, 
  Sparkles, 
  RotateCcw, 
  Trash2,
  Building2, 
  CheckCheck, 
  X,
  Scan,
  Download,
  Sun,
  Moon,
  ShieldCheck,
  Cloud,
  Lock
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { BarcodeScannerModal } from './common/BarcodeScannerModal';
import { DataExportModal } from './common/DataExportModal';
import { SecurityModal } from './security/SecurityModal';

export const Header: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    currency, 
    setCurrency, 
    searchQuery, 
    setSearchQuery,
    setActiveModule,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    resetToDemoData,
    clearAllData,
    theme,
    toggleTheme,
    user,
    syncStatus,
    isPinLocked
  } = useERP();

  const [showNotifications, setShowNotifications] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;


  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-30">
      
      {/* Brand & Company Identifier */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveModule('dashboard')}>
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <div className="w-4 h-4 bg-slate-950 rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">
            {language === 'ar' ? 'نظام ' : 'System '}
            <span className="text-emerald-400">ERP</span>
          </span>
        </div>

        <div className="h-8 w-px bg-slate-800 hidden md:block"></div>

        {/* Global Search Input */}
        <div className="relative flex items-center hidden md:flex">
          <Search className="w-4 h-4 absolute right-3 rtl:right-3 ltr:left-3 ltr:right-auto text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث عن موظف، فاتورة DGI، أو عقد...' : 'Search employees, invoices or contracts...'}
            className="bg-slate-800/50 border border-slate-700 rounded-full pr-10 pl-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 w-72 lg:w-80 focus:outline-none focus:border-emerald-500/50 transition-all rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute left-3 rtl:left-3 ltr:right-3 ltr:left-auto text-slate-400 hover:text-slate-200 text-xs bg-slate-700 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* AI Advisor Button */}
        <button
          onClick={() => setActiveModule('ai-advisor')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold transition border border-emerald-500/30"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">{language === 'ar' ? 'المساعد الذكي' : 'AI Advisor'}</span>
        </button>

        {/* Currency Toggle */}
        <button
          onClick={() => {
            if (currency === 'DZD') setCurrency('EUR');
            else if (currency === 'EUR') setCurrency('USD');
            else setCurrency('DZD');
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium border border-slate-700 transition"
          title={language === 'ar' ? 'تغيير العملة' : 'Toggle Currency'}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>{currency}</span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium border border-slate-700 transition"
          title={language === 'ar' ? 'English' : 'العربية'}
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-slate-200">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-850">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs sm:text-sm">
                    {language === 'ar' ? 'الإشعارات والتنبيهات' : 'Notifications'}
                  </span>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-slate-400 hover:text-slate-200 transition"
                  >
                    {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    {language === 'ar' ? 'لا توجد إشعارات جديدة حالياً' : 'No notifications'}
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3 text-xs transition cursor-pointer hover:bg-slate-800 flex gap-3 ${notif.read ? 'opacity-60' : 'bg-slate-800/50 font-medium'}`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                        notif.type === 'alert' ? 'bg-rose-500' :
                        notif.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-100">{notif.title}</p>
                        <p className="text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Barcode Scanner Button */}
        <button
          onClick={() => setIsBarcodeScannerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition shadow-sm"
          title={language === 'ar' ? 'ماسح الباركود والمنتجات' : 'Barcode Scanner'}
        >
          <Scan className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">{language === 'ar' ? 'الباركود' : 'Barcode'}</span>
        </button>

        {/* Security & Database Button */}
        <button
          onClick={() => setIsSecurityModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs border border-purple-500/40 transition shadow-sm relative"
          title={language === 'ar' ? 'مركز الأمان وقواعد البيانات' : 'Security & Database Center'}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">{language === 'ar' ? 'الأمان وقواعد البيانات' : 'Security & DB'}</span>
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            syncStatus === 'synced' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
          }`} />
          {isPinLocked && <Lock className="w-3 h-3 text-amber-400 ml-1" />}
        </button>

        {/* Export Data Button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30 transition shadow-sm"
          title={language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
        >
          <Download className="w-4 h-4 text-purple-400" />
          <span className="hidden md:inline">{language === 'ar' ? 'تصدير' : 'Export'}</span>
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
          title={language === 'ar' ? (theme === 'dark' ? 'تفعيل الوضع المضيء' : 'تفعيل الوضع الليلي') : 'Toggle Dark/Light Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Clear All Data */}
        <button
          onClick={() => {
            if (confirm(language === 'ar' ? 'هل أنت تأكد من حذف كافة البيانات المسجلة والنظام؟' : 'Are you sure you want to delete all recorded data?')) {
              clearAllData();
            }
          }}
          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
          title={language === 'ar' ? 'حذف البيانات المسجلة' : 'Clear All Data'}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Reset Demo Data */}
        <button
          onClick={() => {
            if (confirm(language === 'ar' ? 'إعادة استرجاع البيانات التجريبية الجزائرية؟' : 'Restore Algerian demo data?')) {
              resetToDemoData();
            }
          }}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 border border-slate-700 transition"
          title={language === 'ar' ? 'استرجاع البيانات التجريبية' : 'Reset Demo Data'}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* User Profile Badge */}
        <div 
          onClick={() => setIsSecurityModalOpen(true)}
          className="flex items-center gap-2 pl-2 border-l rtl:border-l rtl:border-r-0 ltr:border-r-0 ltr:border-l border-slate-800 hidden sm:flex cursor-pointer hover:opacity-80 transition"
        >
          <div className="text-right rtl:text-right ltr:text-left">
            <p className="text-xs font-semibold leading-none text-white">{user?.displayName || 'المدير العام'}</p>
            <p className="text-[10px] text-purple-400 mt-1 uppercase tracking-widest font-bold">{user?.role || 'Admin'} (Cloud DB)</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-purple-500/40 overflow-hidden flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs uppercase">
              {(user?.displayName || 'A').charAt(0)}
            </div>
          </div>
        </div>

      </div>

      {/* Render Modals */}
      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
      />

      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </header>

  );
};
