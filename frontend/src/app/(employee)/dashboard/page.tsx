"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ClipboardList, CheckCircle2, RefreshCw, Calendar, ArrowRight } from "lucide-react";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useMyTasks, useUpdateTaskStatus } from "../../../hooks/useTasks";
import { TaskCard } from "../../../components/tasks/TaskCard";
import { TaskStatusModal } from "../../../components/tasks/TaskStatusModal";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { SkeletonCard } from "../../../components/ui/SkeletonCard";
import { TaskWithLog, TaskStatus } from "../../../types";

export default function EmployeeDashboard() {
  const { user } = useCurrentUser();
  
  // Today's date string representation YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [greeting, setGreeting] = useState("Good morning");
  const [activeTask, setActiveTask] = useState<TaskWithLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useMyTasks(selectedDate);
  const updateStatusMutation = useUpdateTaskStatus();

  // Set greeting according to local time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleUpdateClick = (task: TaskWithLog) => {
    setActiveTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (taskId: string, status: TaskStatus, notes: string) => {
    await updateStatusMutation.mutateAsync({ taskId, status, notes });
  };

  const isReadOnly = selectedDate !== todayStr;

  // Compute metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.log?.status === "COMPLETED").length;
  const remainingTasks = totalTasks - completedTasks;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header section (Tactile flat card) */}
      <Card variant="flat" padding="md" className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-text leading-none mb-1">
            {greeting}, {user?.full_name?.split(" ")[0] || "Team Member"}
          </h2>
          <p className="text-xs text-text/50 font-mono tracking-wider uppercase font-semibold">
            {format(new Date(), "EEEE, dd MMMM yyyy")}
          </p>
        </div>

        {/* Dynamic check-in chip */}
        <div className="flex items-center gap-2 bg-success/10 border border-success/35 px-4 py-2 rounded-full shadow-sm shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00A63D] animate-ping" />
          <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#00A63D]">
            ✅ Active Check-in — 9:04 AM
          </span>
        </div>
      </Card>

      {/* Summary dashboard row metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="flat" padding="sm" className="flex flex-col justify-center items-center text-center">
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text/55 mb-1.5 block">
            Total Tasks
          </span>
          <div className="text-2xl font-black text-primary leading-none">
            {totalTasks}
          </div>
        </Card>

        <Card variant="flat" padding="sm" className="flex flex-col justify-center items-center text-center">
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text/55 mb-1.5 block">
            Completed
          </span>
          <div className="text-2xl font-black text-[#00A63D] leading-none">
            {completedTasks}
          </div>
        </Card>

        <Card variant="flat" padding="sm" className="flex flex-col justify-center items-center text-center">
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-text/55 mb-1.5 block">
            Remaining
          </span>
          <div className="text-2xl font-black text-[#FE9900] leading-none">
            {remainingTasks}
          </div>
        </Card>
      </div>

      {/* Main Task Dashboard Panel Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-text/5 pb-2">
          <h3 className="font-mono text-base font-extrabold text-text uppercase tracking-wider flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            <span>Today's Tasks</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] text-primary border border-primary/25">
              {totalTasks}
            </span>
          </h3>

          {/* Inline Date Switcher controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="neu-input bg-surface shadow-neu-sm-pressed border-0 font-mono text-xs rounded-lg px-2 py-1 outline-none text-text"
              style={{ minHeight: "32px", fontSize: "12px" }}
            />
          </div>
        </div>

        {/* Task cards lists container */}
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="All Clear!"
            description="No tasks assigned for this day yet. Check back later or request task schedules from your manager."
          />
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateStatus={handleUpdateClick}
                isReadOnly={isReadOnly}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Update Modal Popup */}
      <TaskStatusModal
        task={activeTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
