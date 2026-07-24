import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { FinanceView } from './components/finance/FinanceView';
import { SalesView } from './components/sales/SalesView';
import { InventoryView } from './components/inventory/InventoryView';
import { PurchasingView } from './components/purchasing/PurchasingView';
import { HRView } from './components/hr/HRView';
import { ProjectsView } from './components/projects/ProjectsView';
import { AIAssistantView } from './components/ai/AIAssistantView';

const MainContent: React.FC = () => {
  const { activeModule, language, theme } = useERP();

  const renderModuleView = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'finance':
        return <FinanceView />;
      case 'sales':
        return <SalesView />;
      case 'inventory':
        return <InventoryView />;
      case 'purchasing':
        return <PurchasingView />;
      case 'hr':
        return <HRView />;
      case 'projects':
        return <ProjectsView />;
      case 'ai-advisor':
        return <AIAssistantView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'light-mode bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} font-sans flex flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderModuleView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainContent />
    </ERPProvider>
  );
}
