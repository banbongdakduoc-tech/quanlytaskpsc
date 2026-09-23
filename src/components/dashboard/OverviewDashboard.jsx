import React from 'react';
import AnnouncementBanner from './AnnouncementBanner';
import BigMetricCards from './BigMetricCards';
import MiniSchedule from './MiniSchedule';
import UrgentTaskList from './UrgentTaskList';
import DepartmentStats from './DepartmentStats';

export default function OverviewDashboard({
  plans,
  tasks,
  announcement,
  onToggleTask,
  onOpenTaskDetail,
  onOpenAddTask,
  onSelectEvent,
  onNavigateTab,
  onSelectDepartment,
  selectedDepartment
}) {
  // Filter tasks and plans if a department is filtered (except 'all')
  const filteredTasks = selectedDepartment === 'all' 
    ? tasks 
    : tasks.filter(t => t.departmentId === selectedDepartment);

  const filteredPlans = selectedDepartment === 'all'
    ? plans
    : plans.filter(p => p.departmentId === selectedDepartment);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Urgent Announcement from BCN */}
      <AnnouncementBanner
        announcement={announcement}
        onOpenAction={() => onNavigateTab('communication')}
      />

      {/* 2. Big Stats Cards */}
      <BigMetricCards
        plans={filteredPlans}
        tasks={filteredTasks}
        onNavigateToUrgent={() => {
          const el = document.getElementById('urgent-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onNavigateToBudget={() => onNavigateTab('plans')}
      />

      {/* 3. Mini Schedule 7 days */}
      <MiniSchedule
        onSelectEvent={onSelectEvent}
        onNavigateTimeline={() => onNavigateTab('timeline')}
      />

      {/* 4. Two columns: Urgent Tasks & Department breakdown */}
      <div id="urgent-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <UrgentTaskList
            tasks={filteredTasks}
            onToggleTask={onToggleTask}
            onOpenTaskDetail={onOpenTaskDetail}
            onOpenAddTask={onOpenAddTask}
          />
        </div>
        <div className="lg:col-span-5">
          <DepartmentStats
            tasks={tasks}
            onSelectDepartment={onSelectDepartment}
          />
        </div>
      </div>
    </div>
  );
}
