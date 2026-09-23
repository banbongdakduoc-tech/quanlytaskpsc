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
import DeptMediaHub from './components/media/DeptMediaHub';
import DepartmentsRoster from './components/departments/DepartmentsRoster';
import ProgramsHub from './components/programs/ProgramsHub';
import AssignProgramModal from './components/programs/AssignProgramModal';
import SuggestTaskModal from './components/programs/SuggestTaskModal';
import ProgramDetailModal from './components/programs/ProgramDetailModal';
import Toast from './components/common/Toast';

import { DEPARTMENTS } from './data/departments';
import { 
  subscribeToTasks, 
  subscribeToBudgets, 
  subscribeToMediaPlans, 
  subscribeToMediaCalendar,
  subscribeToAccounts,
  subscribeToPrograms,
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
    return 'programs';
  });

  // Realtime Data from Firebase RTDB
  const [programs, setPrograms] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [mediaPlans, setMediaPlans] = useState([]);
  const [mediaCalendar, setMediaCalendar] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAssignProgramModalOpen, setIsAssignProgramModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateDeptTaskModalOpen, setIsCreateDeptTaskModalOpen] = useState(false);
  const [createTaskModalProgramId, setCreateTaskModalProgramId] = useState('');
  const [isSubmitMediaModalOpen, setIsSubmitMediaModalOpen] = useState(false);
  const [submitMediaModalProgramId, setSubmitMediaModalProgramId] = useState('');
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [programDetailModalTarget, setProgramDetailModalTarget] = useState(null);
  const [suggestTaskModalProgram, setSuggestTaskModalProgram] = useState(null);
  const [selectedMediaProgramFilter, setSelectedMediaProgramFilter] = useState('all');
  const [toast, setToast] = useState(null);

  // Initialize Firebase subscriptions and accounts
  useEffect(() => {
    initDefaultAccountsIfEmpty().catch(console.error);

    const unsubPrograms = subscribeToPrograms((data) => {
      setPrograms(data);
    });

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
      unsubPrograms();
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
      setCurrentTab('programs');
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
    } else {
      setCurrentTab('programs');
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
        onOpenAssignProgramModal={() => setIsAssignProgramModalOpen(true)}
        onOpenAssignTaskModal={() => setIsAssignModalOpen(true)}
        onOpenCreateTaskModal={() => {
          setCreateTaskModalProgramId('');
          setIsCreateDeptTaskModalOpen(true);
        }}
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

        {/* TAB CHƯƠNG TRÌNH (DÀNH CHO CẢ BCN VÀ CÁC PHÂN BAN) */}
        {currentTab === 'programs' && (
          <ProgramsHub
            programs={programs}
            tasks={tasks}
            mediaPlans={mediaPlans}
            currentDept={currentDept}
            onOpenAssignProgramModal={() => setIsAssignProgramModalOpen(true)}
            onOpenSuggestTaskModal={(p) => setSuggestTaskModalProgram(p)}
            onSelectProgram={(p) => setProgramDetailModalTarget(p)}
            onNotify={(msg) => showToast(msg)}
          />
        )}

        {/* BAN CHỦ NHIỆM (CẤP 1) VIEWS */}
        {isBCN && currentTab === 'dashboard' && (
          <BcnOverviewDashboard
            programs={programs}
            tasks={tasks}
            budgets={budgets}
            mediaPlans={mediaPlans}
            onNavigateTab={setCurrentTab}
            onOpenAssignProgramModal={() => setIsAssignProgramModalOpen(true)}
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
            programs={programs}
            currentDept={currentDept}
            onNotify={(msg) => showToast(msg)}
            initialTab="realtime"
            initialProgramFilter={selectedMediaProgramFilter}
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
            programs={programs}
            currentDept={currentDept}
            onOpenCreateTaskModal={(progId = '') => {
              setCreateTaskModalProgramId(progId);
              setIsCreateDeptTaskModalOpen(true);
            }}
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
        {/* 6 Ban chuyên trách: Giao diện kế hoạch truyền thông theo chương trình */}
        {!isBCN && !isMedia && currentTab === 'media-request' && (
          <DeptMediaHub
            mediaPlans={mediaPlans}
            programs={programs}
            currentDept={currentDept}
            initialProgramFilter={selectedMediaProgramFilter}
            onOpenSubmitMediaModal={(progId = '') => {
              setSubmitMediaModalProgramId(progId);
              setIsSubmitMediaModalOpen(true);
            }}
            onNotify={(msg) => showToast(msg)}
          />
        )}

        {/* BAN TRUYỀN THÔNG (CẤP 2 - ĐẶC BIỆT) VIEWS */}
        {isMedia && (currentTab === 'media-inbox' || currentTab === 'media-calendar') && (
          <MediaHub
            mediaPlans={mediaPlans}
            mediaCalendar={mediaCalendar}
            programs={programs}
            currentDept={currentDept}
            onNotify={(msg) => showToast(msg)}
            initialTab={currentTab === 'media-calendar' ? 'calendar' : 'realtime'}
            initialProgramFilter={selectedMediaProgramFilter}
          />
        )}
      </main>

      {/* 3. Global Modals */}
      {isAssignProgramModalOpen && (
        <AssignProgramModal
          isOpen={isAssignProgramModalOpen}
          onClose={() => setIsAssignProgramModalOpen(false)}
          onSuccess={(msg) => showToast(msg, 'Giao chương trình thành công')}
        />
      )}

      {isAssignModalOpen && (
        <AssignTaskModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          programs={programs}
          onSuccess={(msg) => showToast(msg, 'Giao việc thành công')}
        />
      )}

      {isCreateDeptTaskModalOpen && (
        <CreateDeptTaskModal
          isOpen={isCreateDeptTaskModalOpen}
          onClose={() => {
            setIsCreateDeptTaskModalOpen(false);
            setCreateTaskModalProgramId('');
          }}
          currentDept={currentDept}
          programs={programs}
          defaultProgramId={createTaskModalProgramId}
          onSuccess={(msg) => showToast(msg, 'Tạo việc thành công')}
        />
      )}

      {isSubmitMediaModalOpen && (
        <SubmitMediaPlanModal
          isOpen={isSubmitMediaModalOpen}
          onClose={() => {
            setIsSubmitMediaModalOpen(false);
            setSubmitMediaModalProgramId('');
          }}
          currentDept={currentDept}
          programs={programs}
          defaultProgramId={submitMediaModalProgramId}
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

      {/* Program Detail Modal */}
      {programDetailModalTarget && (
        <ProgramDetailModal
          isOpen={!!programDetailModalTarget}
          onClose={() => setProgramDetailModalTarget(null)}
          program={programs.find(p => p.id === programDetailModalTarget.id) || programDetailModalTarget}
          tasks={tasks}
          mediaPlans={mediaPlans}
          currentDept={currentDept}
          onOpenSuggestTaskModal={(p) => setSuggestTaskModalProgram(p)}
          onOpenCreateDeptTaskModal={(p) => {
            setCreateTaskModalProgramId(p.id);
            setIsCreateDeptTaskModalOpen(true);
          }}
          onOpenSubmitMediaModal={(p) => {
            setSubmitMediaModalProgramId(p.id);
            setIsSubmitMediaModalOpen(true);
          }}
          onNavigateToMediaTab={(p) => {
            setProgramDetailModalTarget(null);
            setSelectedMediaProgramFilter(p ? p.id : 'all');
            if (isBCN) {
              setCurrentTab('media-monitor');
            } else if (isMedia) {
              setCurrentTab('media-inbox');
            } else {
              setCurrentTab('media-request');
            }
          }}
          onNotify={(msg) => showToast(msg)}
        />
      )}

      {/* Suggest Task Modal (BCN Propose task for a department program) */}
      {suggestTaskModalProgram && (
        <SuggestTaskModal
          isOpen={!!suggestTaskModalProgram}
          onClose={() => setSuggestTaskModalProgram(null)}
          program={suggestTaskModalProgram}
          onSuccess={(msg) => showToast(msg, 'Đề xuất task thành công')}
        />
      )}

      {/* 4. Feedback Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
