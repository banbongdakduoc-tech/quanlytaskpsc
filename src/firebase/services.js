import { ref, onValue, set, push, update, remove, get } from 'firebase/database';
import { db } from './config';
import { DEPARTMENTS } from '../data/departments';

// ----------------------------------------------------
// 1. ACCOUNTS & ROLES SERVICE
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

export async function initDefaultAccountsIfEmpty() {
  const accountsRef = ref(db, 'accounts');
  const snapshot = await get(accountsRef);
  if (!snapshot.exists()) {
    const initialAccounts = {};
    DEPARTMENTS.forEach((dept) => {
      initialAccounts[dept.id] = {
        id: dept.id,
        deptId: dept.id,
        deptName: dept.name,
        role: dept.role,
        level: dept.level,
        username: dept.username,
        password: dept.defaultPass,
        avatar: dept.avatar,
        status: 'active',
        createdAt: Date.now(),
      };
    });
    await set(accountsRef, initialAccounts);
  }
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
    // Sort newest first
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
