import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  ListTodo,
  TrendingUp
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Modal } from '../common/Modal';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    addProject, 
    tasks, 
    addTask, 
    updateTaskStatus, 
    employees, 
    formatCurrency, 
    language,
    searchQuery
  } = useERP();

  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Form State Project
  const [projName, setProjName] = useState('');
  const [clientName, setClientName] = useState('');
  const [budget, setBudget] = useState(200000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  });

  // Form State Task
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState(employees[0]?.fullName || '');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim() || !clientName.trim()) return;

    addProject({
      name: projName,
      clientName,
      budget: Number(budget),
      startDate,
      endDate,
      status: 'in_progress'
    });

    setIsAddProjectOpen(false);
    setProjName('');
    setClientName('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedProjectId) return;

    addTask({
      projectId: selectedProjectId,
      title: taskTitle,
      assignedTo,
      dueDate,
      priority,
      status: 'todo'
    });

    setIsAddTaskOpen(false);
    setTaskTitle('');
  };

  const filteredProjects = projects.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-400" />
            <span>{language === 'ar' ? 'إدارة المشاريع واللوحة التنفيذية (Kanban Board)' : 'Projects & Task Management'}</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {language === 'ar' 
              ? 'متابعة نِسَب إنجاز المخرجات، الميزانيات التقديرية وتعيين المهام لفريق العمل.' 
              : 'Track project milestones, budget vs spend & interactive Kanban workflow.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>{language === 'ar' ? 'إضافة مهمة' : 'Add Task'}</span>
          </button>

          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-950/40 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'مشروع جديد' : 'New Project'}</span>
          </button>
        </div>
      </div>

      {/* Projects Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProjects.map(proj => (
          <div key={proj.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-white text-sm line-clamp-1">{proj.name}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                {proj.progress}%
              </span>
            </div>

            <p className="text-xs text-slate-400">العميل: {proj.clientName}</p>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all"
                style={{ width: `${proj.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>الميزانية: <strong className="text-emerald-400">{formatCurrency(proj.budget)}</strong></span>
              <span>المصروف: <strong className="text-slate-200">{formatCurrency(proj.spent)}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Kanban Task Board */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-indigo-400" />
          <span>{language === 'ar' ? 'لوحة المهام التفصيلية (Kanban Tasks)' : 'Task Workflow Board'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* TODO Column */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                {language === 'ar' ? 'قيد الانتظار (To Do)' : 'To Do'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {tasks.filter(t => t.status === 'todo').length}
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.filter(t => t.status === 'todo').map(task => (
                <div key={task.id} className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-md space-y-2 text-xs">
                  <p className="font-bold text-white">{task.title}</p>
                  <p className="text-slate-400">المسؤول: {task.assignedTo}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                    <span className="text-[10px] text-slate-400">{task.dueDate}</span>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      className="px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold transition"
                    >
                      {language === 'ar' ? 'بدء العمل ←' : 'Start →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-blue-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                {language === 'ar' ? 'جاري التنفيذ (In Progress)' : 'In Progress'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {tasks.filter(t => t.status === 'in_progress').length}
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.filter(t => t.status === 'in_progress').map(task => (
                <div key={task.id} className="p-3.5 rounded-xl bg-slate-800/90 border border-blue-500/30 shadow-md space-y-2 text-xs">
                  <p className="font-bold text-white">{task.title}</p>
                  <p className="text-slate-400">المسؤول: {task.assignedTo}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                    <span className="text-[10px] text-slate-400">{task.dueDate}</span>
                    <button
                      onClick={() => updateTaskStatus(task.id, 'completed')}
                      className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold transition"
                    >
                      {language === 'ar' ? 'إكمال ✓' : 'Complete ✓'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMPLETED Column */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 min-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {language === 'ar' ? 'مكتملة (Completed)' : 'Completed'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {tasks.filter(t => t.status === 'completed').length}
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.filter(t => t.status === 'completed').map(task => (
                <div key={task.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/40 opacity-80 space-y-2 text-xs">
                  <p className="font-bold text-slate-200 line-through">{task.title}</p>
                  <p className="text-slate-500">المسؤول: {task.assignedTo}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modal: Add Project */}
      <Modal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        title={language === 'ar' ? 'إضافة مشروع جديد' : 'New Project'}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'اسم المشروع' : 'Project Title'}</label>
            <input
              type="text"
              required
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'اسم العميل' : 'Client Name'}</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'الميزانية المعتمدة' : 'Budget'}</label>
            <input
              type="number"
              required
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddProjectOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
            >
              {language === 'ar' ? 'حفظ المشروع' : 'Save Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Task */}
      <Modal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        title={language === 'ar' ? 'إضافة مهمة جديدة' : 'Add Task'}
        maxWidth="md"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'اختر المشروع' : 'Select Project'}</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'عنوان المهمة' : 'Task Title'}</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{language === 'ar' ? 'تعيين إلى (الموظف)' : 'Assigned Employee'}</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {employees.map(e => (
                <option key={e.id} value={e.fullName}>{e.fullName} ({e.jobTitle})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddTaskOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
            >
              {language === 'ar' ? 'إضافة المهمة' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
