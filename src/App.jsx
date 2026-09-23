import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import LoginScreen from './components/auth/LoginScreen';
import CreateAccountModal from './components/auth/CreateAccountModal';
import AssignTaskModal from './components/tasks/AssignTaskModal';
import CreateDeptTaskModal from './components/tasks/CreateDeptTaskModal';
import PendingAcceptanceSection from './components/tasks/PendingAcceptanceSection';
import DeptTasksHub from './components/tasks/DeptTasksHub';
import BcnTasksManager from './components/tasks/BcnTasksManager';
import BcnOverviewDashboard from './components/dashboard/BcnOverviewDashboard';
import BudgetManager from './components/budget/BudgetManager';
import SubmitMediaPlanModal from './components/media/SubmitMediaPlanModal';
import MediaHub from './components/media/MediaHub';
import DepartmentsRoster from './components/departments/DepartmentsRoster';
import Toast from './components/common/Toast';

import { DEPARTMENTS } from './data/departments';
import { 
  subscribeToTasks, 
  subscribeToBudgets, 
  subscribeToMediaPlans, 
  subscribeToMediaCalendar,
  subscribeToAccounts,
  initDefaultAccountsIfEmpty 
} from './firebase/services';

export default function App() {
  // Current user authentication session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('upc_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Current active department / role
  const [currentDept, setCurrentDept] = useState(() => {
    if (currentUser?.deptId) {
      return DEPARTMENTS.find(d => d.id === currentUser.deptId) || DEPARTMENTS[0];
    }
    return DEPARTMENTS[0];
  });

  const [currentTab, setCurrentTab] = useState(() => {
    if (currentUser?.deptId === 'bcn') return 'dashboard';
    return 'my-tasks';
  });

  // Realtime Data from Firebase RTDB (NO MOCK DATA - user will create)
  const [tasks, setTasks] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [mediaPlans, setMediaPlans] = useState([]);
  const [mediaCalendar, setMediaCalendar] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateDeptTaskModalOpen, setIsCreateDeptTaskModalOpen] = useState(false);
  const [isSubmitMediaModalOpen, setIsSubmitMediaModalOpen] = useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Initialize Firebase subscriptions and accounts
  useEffect(() => {
    initDefaultAccountsIfEmpty().catch(console.error);

    const unsubTasks = subscribeToTasks((data) => {
      setTasks(data);
      setIsLoading(false);
    });

    const unsubBudgets = subscribeToBudgets((data) => {
      setBudgets(data);
    });

    const unsubMediaPlans = subscribeToMediaPlans((data) => {
      setMediaPlans(data);
    });

    const unsubMediaCalendar = subscribeToMediaCalendar((data) => {
      setMediaCalendar(data);
    });

    const unsubAccounts = subscribeToAccounts((data) => {
      setAccounts(data);
    });

    return () => {
      unsubTasks();
      unsubBudgets();
      unsubMediaPlans();
      unsubMediaCalendar();
      unsubAccounts();
    };
  }, []);

  // Login handler
  const handleLoginSuccess = (account) => {
    setCurrentUser(account);
    localStorage.setItem('upc_auth_user', JSON.stringify(account));
    
    const matchedDept = DEPARTMENTS.find(d => d.id === account.deptId) || DEPARTMENTS[0];
    setCurrentDept(matchedDept);
    
    if (matchedDept.id === 'bcn') {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('my-tasks');
    }

    setToast({
      title: 'Đăng nhập thành công',
      message: `Chào mừng ${account.name || account.username} (${matchedDept.name})`,
      type: 'success',
    });
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('upc_auth_user');
    setCurrentUser(null);
    setToast({
      title: 'Đã đăng xuất',
      message: 'Bạn đã đăng xuất khỏi phiên làm việc an toàn.',
      type: 'info',
    });
  };

  // When switching department, reset tab appropriately
  const handleSelectDept = (dept) => {
    setCurrentDept(dept);
    if (dept.id === 'bcn') {
      setCurrentTab('dashboard');
    } else if (dept.id === 'truyen-thong') {
      setCurrentTab('my-tasks');
    } else {
      setCurrentTab('my-tasks');
    }

    setToast({
      title: 'Chuyển vai trò thành công',
      message: `Đang thao tác với quyền: ${dept.name} (${dept.badge})`,
      type: 'info',
    });
  };

  const showToast = (message, title = 'Thành công') => {
    setToast({ title, message, type: 'success' });
  };

  // If user is not logged in, render the login screen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const isBCN = currentDept.id === 'bcn';
  const isMedia = currentDept.id === 'truyen-thong';

  // Count pending acceptance for current department
  const pendingAcceptanceCount = tasks.filter(
    (t) => t.assignedDeptId === currentDept.id && t.status === 'pending_acceptance'
  ).length;

  return (
    <div className="min-h-screen bg-[#080B0C] text-slate-100 flex flex-col font-sans">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentDept={currentDept}
        onSelectDept={handleSelectDept}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingAcceptanceCount={pendingAcceptanceCount}
        onOpenAssignTaskModal={() => setIsAssignModalOpen(true)}
        onOpenCreateTaskModal={() => setIsCreateDeptTaskModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Main Work Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Banner: Nhiệm vụ mới BCN giao đang chờ xác nhận tiếp nhận */}
        {!isBCN && (
          <PendingAcceptanceSection
            tasks={tasks}
            currentDept={currentDept}
            onTaskAccepted={(msg) => showToast(msg, 'Tiếp nhận thành công')}
          />
        )}

        {/* ----------------- ROUTING LOGIC ----------------- */}

        {/* BAN CHỦ NHIỆM (CẤP 1) VIEWS */}
        {isBCN && currentTab === 'dashboard' && (
          <BcnOverviewDashboard
            tasks={tasks}
            budgets={budgets}
            mediaPlans={mediaPlans}
            onNavigateTab={setCurrentTab}
            onOpenAssignModal={() => setIsAssignModalOpen(true)}
          />
        )}

        {isBCN && currentTab === 'all-tasks' && (
          <BcnTasksManager
            tasks={tasks}
            onOpenAssignModal={() => setIsAssignModalOpen(true)}
            onNotify={(msg) => showToast(msg)}
          />
        )}

        {isBCN && currentTab === 'budgets' && (
          <BudgetManager
            budgets={budgets}
            currentDept={currentDept}
            onNotify={(msg) => showToast(msg)}
          />
        )}

        {isBCN && currentTab === 'media-monitor' && (
          <MediaHub
            mediaPlans={mediaPlans}
            mediaCalendar={mediaCalendar}
            currentDept={currentDept}
            onNotify={(msg) => showToast(msg)}
            initialTab="inbox"
          />
        )}

        {isBCN && currentTab === 'departments' && (
          <DepartmentsRoster
            tasks={tasks}
            budgets={budgets}
            mediaPlans={mediaPlans}
            accounts={accounts}
            currentDept={currentDept}
            onSelectDept={handleSelectDept}
            onOpenCreateAccountModal={() => setIsCreateAccountModalOpen(true)}
            onNotify={(msg) => showToast(msg)}
          />
        )}

        {/* BAN THÀNH PHẦN (CẤP 2) VIEWS */}
        {!isBCN && currentTab === 'my-tasks' && (
          <DeptTasksHub
            tasks={tasks}
            currentDept={currentDept}
            onOpenCreateTaskModal={() => setIsCreateDeptTaskModalOpen(true)}
            onNotify={(msg) => showToast(msg)}
          />
        )}

        {!isBCN && currentTab === 'budgets' && (
          <BudgetManager
            budgets={budgets}
            currentDept={currentDept}
            onNotify={(msg) => showToast(msg)}
          />
        )}

        {/* 6 Ban chuyên trách submit media request */}
        {!isBCN && !isMedia && currentTab === 'media-request' && (
          <div className="space-y-6 animate-fadeIn pb-12">
            <div className="p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Kế Hoạch Truyền Thông • {currentDept.name}
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                  Đăng Ký Đẩy Bài Fanpage & TikTok CLB
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Kế hoạch sẽ được gửi đồng thời lên Ban Chủ Nhiệm và Ban Truyền Thông để bố trí lịch phát sóng
                </p>
              </div>

              <button
                onClick={() => setIsSubmitMediaModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-black font-extrabold text-xs transition shadow-lg shadow-teal-500/20 active:scale-95 shrink-0"
              >
                + Gửi Kế Hoạch Truyền Thông
              </button>
            </div>

            {/* List of plans submitted by this department */}
            <div className="card-sporty p-5">
              <h3 className="font-extrabold text-white text-base mb-3">
                Kế Hoạch Đã Gửi Của {currentDept.name}
              </h3>
              {mediaPlans.filter(m => m.deptId === currentDept.id).length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-xs">Chưa có kế hoạch truyền thông nào được gửi.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mediaPlans.filter(m => m.deptId === currentDept.id).map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-[#0E1416] border border-white/5 flex items-center justify-between gap-4">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'scheduled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {p.status === 'scheduled' ? 'Ban TT đã lên lịch' : 'Đang chờ Ban TT xử lý'}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{p.eventTitle}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{p.contentSummary}</p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{p.scheduledDate}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BAN TRUYỀN THÔNG (CẤP 2 - ĐẶC BIỆT) VIEWS */}
        {isMedia && (currentTab === 'media-inbox' || currentTab === 'media-calendar') && (
          <MediaHub
            mediaPlans={mediaPlans}
            mediaCalendar={mediaCalendar}
            currentDept={currentDept}
            onNotify={(msg) => showToast(msg)}
            initialTab={currentTab === 'media-calendar' ? 'calendar' : 'inbox'}
          />
        )}
      </main>

      {/* 3. Global Modals */}
      {isAssignModalOpen && (
        <AssignTaskModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onSuccess={(msg) => showToast(msg, 'Giao việc thành công')}
        />
      )}

      {isCreateDeptTaskModalOpen && (
        <CreateDeptTaskModal
          isOpen={isCreateDeptTaskModalOpen}
          onClose={() => setIsCreateDeptTaskModalOpen(false)}
          currentDept={currentDept}
          onSuccess={(msg) => showToast(msg, 'Tạo việc thành công')}
        />
      )}

      {isSubmitMediaModalOpen && (
        <SubmitMediaPlanModal
          isOpen={isSubmitMediaModalOpen}
          onClose={() => setIsSubmitMediaModalOpen(false)}
          currentDept={currentDept}
          onSuccess={(msg) => showToast(msg, 'Gửi truyền thông thành công')}
        />
      )}

      {isCreateAccountModalOpen && (
        <CreateAccountModal
          isOpen={isCreateAccountModalOpen}
          onClose={() => setIsCreateAccountModalOpen(false)}
          onSuccess={(msg) => showToast(msg, 'Tạo tài khoản thành công')}
        />
      )}

      {/* 4. Feedback Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
