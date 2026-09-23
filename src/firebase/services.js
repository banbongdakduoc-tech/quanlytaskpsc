import { ref, onValue, set, push, update, remove, get } from 'firebase/database';
import { db } from './config';

// ----------------------------------------------------
// 1. ACCOUNTS & AUTH SERVICE
// ----------------------------------------------------
export function subscribeToAccounts(callback) {
  const accountsRef = ref(db, 'accounts');
  return onValue(accountsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback({});
      return;
    }
    callback(data);
  });
}

// Initialize default BCN root account on Firebase if not present
export async function initDefaultAccountsIfEmpty() {
  const bcnAccountRef = ref(db, 'accounts/bcnpsc');
  const snapshot = await get(bcnAccountRef);
  
  if (!snapshot.exists()) {
    const bcnAccount = {
      username: 'bcnpsc',
      password: '123123',
      deptId: 'bcn',
      deptName: 'Ban Chủ Nhiệm',
      role: 'bcn',
      level: 1,
      name: 'Ban Chủ Nhiệm PharmacySportCLB',
      createdAt: Date.now(),
      createdBy: 'system',
    };

    await set(bcnAccountRef, bcnAccount);
  }
}

export async function authenticateUser(username, password) {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Special reliable check for root BCN account
  if (cleanUsername === 'bcnpsc' && cleanPassword === '123123') {
    const accountRef = ref(db, `accounts/bcnpsc`);
    const snapshot = await get(accountRef);
    if (!snapshot.exists()) {
      const bcnAccount = {
        username: 'bcnpsc',
        password: '123123',
        deptId: 'bcn',
        deptName: 'Ban Chủ Nhiệm',
        role: 'bcn',
        level: 1,
        name: 'Ban Chủ Nhiệm PharmacySportCLB',
        createdAt: Date.now(),
        createdBy: 'system',
      };
      await set(accountRef, bcnAccount);
      return bcnAccount;
    }
    return snapshot.val();
  }

  const accountRef = ref(db, `accounts/${cleanUsername}`);
  const snapshot = await get(accountRef);

  if (!snapshot.exists()) {
    throw new Error(`Tài khoản "${cleanUsername}" không tồn tại trên hệ thống.`);
  }

  const account = snapshot.val();
  if (account.password !== cleanPassword) {
    throw new Error('Mật khẩu không chính xác. Vui lòng kiểm tra lại.');
  }

  return account;
}

export async function createAccountByBCN(accountData) {
  const cleanUsername = accountData.username.trim().toLowerCase();
  const accountRef = ref(db, `accounts/${cleanUsername}`);
  const existing = await get(accountRef);

  if (existing.exists()) {
    throw new Error(`Tên đăng nhập "${cleanUsername}" đã được sử dụng`);
  }

  const newAccount = {
    username: cleanUsername,
    password: accountData.password.trim(),
    deptId: accountData.deptId,
    deptName: accountData.deptName,
    role: accountData.role || (accountData.deptId === 'bcn' ? 'bcn' : 'department'),
    level: accountData.deptId === 'bcn' ? 1 : 2,
    name: accountData.name || accountData.deptName,
    createdAt: Date.now(),
    createdBy: 'bcn',
  };

  await set(accountRef, newAccount);
  return newAccount;
}

export async function deleteAccount(username) {
  const cleanUsername = username.trim().toLowerCase();
  if (cleanUsername === 'bcnpsc') {
    throw new Error('Không thể xóa tài khoản quản trị Ban Chủ Nhiệm gốc');
  }
  const accountRef = ref(db, `accounts/${cleanUsername}`);
  await remove(accountRef);
}

export async function updateAccountPassword(username, newPassword) {
  const cleanUsername = username.trim().toLowerCase();
  const accountRef = ref(db, `accounts/${cleanUsername}`);
  await update(accountRef, {
    password: newPassword.trim(),
    updatedAt: Date.now(),
  });
}

// ----------------------------------------------------
// 2. TASKS SERVICE (BCN Giao Việc & Ban Nhận Việc)
// ----------------------------------------------------
export function subscribeToTasks(callback) {
  const tasksRef = ref(db, 'tasks');
  return onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    const list = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(list);
  });
}

export async function createTask(taskData) {
  const tasksRef = ref(db, 'tasks');
  const newTaskRef = push(tasksRef);
  const task = {
    ...taskData,
    id: newTaskRef.key,
    programId: taskData.programId || '',
    programTitle: taskData.programTitle || '',
    suggestedByBcn: !!taskData.suggestedByBcn,
    status: taskData.status || 'pending_acceptance', // 'pending_acceptance' | 'accepted'
    column: taskData.column || 'todo', // 'todo' | 'in_progress' | 'done' | 'cancelled'
    priority: taskData.priority || 'medium', // 'urgent' | 'high' | 'medium' | 'low'
    todos: taskData.todos || [], // Array of { id, text, done, priority }
    createdAt: Date.now(),
    createdBy: taskData.createdBy || 'bcn',
  };
  await set(newTaskRef, task);
  return task;
}

export async function acceptTask(taskId, deptId) {
  const taskRef = ref(db, `tasks/${taskId}`);
  await update(taskRef, {
    status: 'accepted',
    acceptedAt: Date.now(),
    acceptedByDept: deptId,
  });
}

export async function updateTask(taskId, updates) {
  const taskRef = ref(db, `tasks/${taskId}`);
  await update(taskRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteTask(taskId) {
  const taskRef = ref(db, `tasks/${taskId}`);
  await remove(taskRef);
}

export async function addTodoToTask(taskId, existingTodos = [], newTodoText, priority = 'medium') {
  const taskRef = ref(db, `tasks/${taskId}`);
  const newTodo = {
    id: `todo-${Date.now()}`,
    text: newTodoText,
    done: false,
    priority: priority,
    createdAt: Date.now(),
  };
  const updatedTodos = [...existingTodos, newTodo];
  await update(taskRef, {
    todos: updatedTodos,
    updatedAt: Date.now(),
  });
}

export async function toggleTodoInTask(taskId, existingTodos = [], todoId) {
  const taskRef = ref(db, `tasks/${taskId}`);
  const updatedTodos = existingTodos.map((t) =>
    t.id === todoId ? { ...t, done: !t.done } : t
  );
  await update(taskRef, {
    todos: updatedTodos,
    updatedAt: Date.now(),
  });
}

// ----------------------------------------------------
// 3. BUDGET PROPOSALS SERVICE (Ban Lập Dự Trù & BCN Duyệt)
// ----------------------------------------------------
export function subscribeToBudgets(callback) {
  const budgetsRef = ref(db, 'budgets');
  return onValue(budgetsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    const list = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(list);
  });
}

export async function createBudgetProposal(budgetData) {
  const budgetsRef = ref(db, 'budgets');
  const newBudgetRef = push(budgetsRef);
  const budget = {
    ...budgetData,
    id: newBudgetRef.key,
    status: 'pending_approval', // 'pending_approval' | 'approved' | 'rejected'
    createdAt: Date.now(),
  };
  await set(newBudgetRef, budget);
  return budget;
}

export async function updateBudgetStatus(budgetId, status, note = '') {
  const budgetRef = ref(db, `budgets/${budgetId}`);
  await update(budgetRef, {
    status: status,
    approvalNote: note,
    reviewedAt: Date.now(),
  });
}

// ----------------------------------------------------
// 4. MEDIA PLANS SERVICE (Ban Gửi Kế Hoạch & Ban TT Tiếp Nhận)
// ----------------------------------------------------
export function subscribeToMediaPlans(callback) {
  const mediaRef = ref(db, 'mediaPlans');
  return onValue(mediaRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    const list = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(list);
  });
}

export async function createMediaPlan(planData) {
  const mediaRef = ref(db, 'mediaPlans');
  const newPlanRef = push(mediaRef);
  const plan = {
    ...planData,
    id: newPlanRef.key,
    programId: planData.programId || '',
    programTitle: planData.programTitle || '',
    status: 'submitted', // 'submitted' | 'accepted_by_media' | 'scheduled' | 'published'
    createdAt: Date.now(),
  };
  await set(newPlanRef, plan);
  return plan;
}

export async function updateMediaPlanStatus(planId, updates) {
  const planRef = ref(db, `mediaPlans/${planId}`);
  await update(planRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteMediaPlan(planId) {
  const planRef = ref(db, `mediaPlans/${planId}`);
  await remove(planRef);
}

export async function requestDeleteMediaPlan(planId, requestedByDeptName, requestedByDeptId, reason = '') {
  const planRef = ref(db, `mediaPlans/${planId}`);
  await update(planRef, {
    deletionRequested: true,
    deletionRequestedBy: requestedByDeptName,
    deletionRequestedDeptId: requestedByDeptId,
    deletionReason: reason,
    deletionRequestedAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function cancelDeleteMediaPlanRequest(planId) {
  const planRef = ref(db, `mediaPlans/${planId}`);
  await update(planRef, {
    deletionRequested: false,
    deletionRequestedBy: null,
    deletionRequestedDeptId: null,
    deletionReason: null,
    deletionRequestedAt: null,
    updatedAt: Date.now(),
  });
}

// ----------------------------------------------------
// 5. MEDIA CALENDAR SERVICE (Lịch Cá Nhân / Lịch Truyền Thông)
// ----------------------------------------------------
export function subscribeToMediaCalendar(callback) {
  const calRef = ref(db, 'mediaCalendar');
  return onValue(calRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    const list = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    list.sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''));
    callback(list);
  });
}

export async function addEventToMediaCalendar(eventData) {
  const calRef = ref(db, 'mediaCalendar');
  const newEventRef = push(calRef);
  const event = {
    ...eventData,
    id: newEventRef.key,
    createdAt: Date.now(),
  };
  await set(newEventRef, event);
  return event;
}

export async function updateMediaCalendarEvent(eventId, updates) {
  const eventRef = ref(db, `mediaCalendar/${eventId}`);
  await update(eventRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteMediaCalendarEvent(eventId) {
  const eventRef = ref(db, `mediaCalendar/${eventId}`);
  await remove(eventRef);
}

// ----------------------------------------------------
// 6. PROGRAMS SERVICE (BCN Giao Chương Trình & Ban Tổ Chức)
// ----------------------------------------------------
export function subscribeToPrograms(callback) {
  const programsRef = ref(db, 'programs');
  return onValue(programsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    const list = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(list);
  });
}

export async function createProgram(programData) {
  const programsRef = ref(db, 'programs');
  const newProgramRef = push(programsRef);
  const program = {
    ...programData,
    id: newProgramRef.key,
    status: programData.status || 'planning', // 'planning' | 'in_progress' | 'completed' | 'cancelled'
    createdAt: Date.now(),
    createdBy: programData.createdBy || 'bcn',
  };
  await set(newProgramRef, program);
  return program;
}

export async function updateProgram(programId, updates) {
  const programRef = ref(db, `programs/${programId}`);
  await update(programRef, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteProgram(programId) {
  const programRef = ref(db, `programs/${programId}`);
  await remove(programRef);
}

// ----------------------------------------------------
// 7. DEPARTMENT LOGOS SERVICE (Logo tùy chỉnh các ban)
// ----------------------------------------------------
export function subscribeToDepartmentLogos(callback) {
  const logosRef = ref(db, 'departmentLogos');
  return onValue(logosRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });
}

export async function updateDepartmentLogo(deptId, logoUrl) {
  const logoRef = ref(db, `departmentLogos/${deptId}`);
  await set(logoRef, logoUrl);
}

export async function resetDepartmentLogo(deptId) {
  const logoRef = ref(db, `departmentLogos/${deptId}`);
  await remove(logoRef);
}


