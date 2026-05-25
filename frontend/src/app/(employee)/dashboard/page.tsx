"use client";

import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek, parseISO } from "date-fns";
import {
  CheckCircle2,
  Clock,
  PauseCircle,
  Circle,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Sparkles,
  TrendingUp,
  Bell,
} from "lucide-react";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useMyTasks, useUpdateTaskStatus } from "../../../hooks/useTasks";
import { TaskStatusModal } from "../../../components/tasks/TaskStatusModal";
import { Badge } from "../../../components/ui/Badge";
import { SkeletonCard } from "../../../components/ui/SkeletonCard";
import { Avatar } from "../../../components/ui/Avatar";
import { TaskWithLog, TaskStatus } from "../../../types";

// ── helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function statusMeta(status?: string | null) {
  switch ((status ?? "NOT_STARTED").toUpperCase()) {
    case "COMPLETED":
      return {
        icon: CheckCircle2,
        bar: "bg-emerald-500",
        ring: "ring-emerald-100",
        text: "text-emerald-600",
        pct: 100,
        gradient: "from-emerald-500 to-teal-500",
      };
    case "IN_PROGRESS":
      return {
        icon: Clock,
        bar: "bg-blue-500",
        ring: "ring-blue-100",
        text: "text-blue-600",
        pct: 55,
        gradient: "from-blue-500 to-[#3A9DE9]",
      };
    case "PENDING":
      return {
        icon: PauseCircle,
        bar: "bg-amber-400",
        ring: "ring-amber-100",
        text: "text-amber-600",
        pct: 25,
        gradient: "from-amber-400 to-orange-400",
      };
    default:
      return {
        icon: Circle,
        bar: "bg-slate-300",
        ring: "ring-slate-100",
        text: "text-slate-400",
        pct: 0,
        gradient: "from-slate-400 to-slate-500",
      };
  }
}

// Build a 7-day week strip anchored on today
function buildWeekDays(anchor: Date) {
  const start = startOfWeek(anchor, { weekStartsOn: 0 }); // Sunday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

// ── stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ComponentType<any>;
  accent: string;
}) {
  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-4 flex items-center gap-3.5 shadow-sm overflow-hidden">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
          {value}
        </p>
        <p className="text-[10px] font-semibold text-slate-400 truncate">{sub}</p>
      </div>
    </div>
  );
}

// ── task card ─────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  isReadOnly,
  onClick,
  index,
}: {
  task: TaskWithLog;
  isReadOnly: boolean;
  onClick: () => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const status = task.log?.status ?? "NOT_STARTED";
  const meta = statusMeta(status);
  const StatusIcon = meta.icon;

  const cardGradients = [
    "from-blue-600 via-blue-500 to-[#3A9DE9]",
    "from-violet-600 via-purple-500 to-indigo-500",
    "from-rose-500 via-pink-500 to-fuchsia-500",
    "from-amber-500 via-orange-500 to-yellow-500",
    "from-teal-500 via-emerald-500 to-cyan-500",
  ];

  const isHero = index < 2;

  if (isHero) {
    const gradient = cardGradients[index % cardGradients.length];
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} text-white p-5 shadow-lg flex flex-col justify-between min-h-[168px] cursor-pointer active:scale-[0.98] transition-all duration-200`}
        onClick={onClick}
      >
        {/* Decorative blobs */}
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/70">
              {task.assigned_to?.department || "Engineering"}
            </span>
            <span className="text-[9px] font-semibold text-white/60 shrink-0">
              {format(parseISO(task.assignment_date), "MMM dd")}
            </span>
          </div>
          <h4 className="text-[15px] font-extrabold tracking-tight mt-2 leading-snug line-clamp-2">
            {task.title}
          </h4>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center text-[11px] font-bold mb-1.5">
            <span className="flex items-center gap-1.5">
              <StatusIcon className="w-3.5 h-3.5" />
              {task.log ? task.log.status.replace("_", " ") : "NOT STARTED"}
            </span>
            <span>{meta.pct}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-700"
              style={{ width: `${meta.pct}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Standard list card
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className={`h-0.5 w-full bg-gradient-to-r ${meta.gradient}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Task #{index + 1}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
              {task.title}
            </h4>
            {expanded && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-sans">
                {task.description}
              </p>
            )}
            {!expanded && task.description.length > 60 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(true);
                }}
                className="text-[10px] font-bold text-primary mt-1"
              >
                see more
              </button>
            )}
            {expanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
                className="text-[10px] font-bold text-slate-400 mt-1"
              >
                see less
              </button>
            )}
          </div>
          <Badge status={status} className="shrink-0 mt-0.5" />
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <Avatar
              name={task.assigned_by?.full_name || "Manager"}
              size="sm"
            />
            <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[120px]">
              {task.assigned_by?.full_name || "Manager"}
            </span>
          </div>
          {!isReadOnly && (
            <button
              onClick={onClick}
              className="text-[10px] font-extrabold text-primary bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 px-3 py-1.5 rounded-full transition-all active:scale-95"
            >
              Update Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function EmployeeDashboard() {
  const { user } = useCurrentUser();
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [weekAnchor, setWeekAnchor] = useState(new Date());
  const [greeting, setGreeting] = useState("Good morning");
  const [activeTask, setActiveTask] = useState<TaskWithLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | TaskStatus>("ALL");

  const { data: tasks = [], isLoading } = useMyTasks(selectedDate);
  const updateStatusMutation = useUpdateTaskStatus();

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const isReadOnly = selectedDate !== todayStr;

  const filtered =
    activeFilter === "ALL"
      ? tasks
      : tasks.filter(
          (t) => (t.log?.status ?? "NOT_STARTED") === activeFilter
        );

  const total = tasks.length;
  const completed = tasks.filter((t) => t.log?.status === "COMPLETED").length;
  const inProgress = tasks.filter(
    (t) => t.log?.status === "IN_PROGRESS"
  ).length;
  const pending = tasks.filter((t) => t.log?.status === "PENDING").length;
  const notStarted = tasks.filter(
    (t) => !t.log || t.log.status === "NOT_STARTED"
  ).length;

  const weekDays = buildWeekDays(weekAnchor);

  const handleUpdateClick = (task: TaskWithLog) => {
    setActiveTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (
    taskId: string,
    status: TaskStatus,
    notes: string
  ) => {
    await updateStatusMutation.mutateAsync({ taskId, status, notes });
  };

  const filterOptions: { label: string; value: "ALL" | TaskStatus; count: number }[] = [
    { label: "All", value: "ALL", count: total },
    { label: "Completed", value: "COMPLETED", count: completed },
    { label: "In Progress", value: "IN_PROGRESS", count: inProgress },
    { label: "Pending", value: "PENDING", count: pending },
    { label: "Not Started", value: "NOT_STARTED", count: notStarted },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-4">

      {/* ─── GREETING HEADER ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <Avatar
              name={user?.full_name || "User"}
              imageUrl={user?.profile_picture_url}
              size="md"
              className="ring-2 ring-white dark:ring-slate-800 shadow-md"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
              {greeting},
            </p>
            <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-none mt-0.5">
              {user?.full_name?.split(" ")[0] || "There"} 👋
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Today's Date chip */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 rounded-full px-3 py-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {format(new Date(), "EEEE, dd MMM yyyy")}
            </span>
          </div>
        </div>
      </div>

      {/* ─── STAT CARDS ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total Tasks"
          value={total}
          sub="Assigned today"
          icon={ClipboardList}
          accent="bg-slate-700"
        />
        <StatCard
          label="Completed"
          value={completed}
          sub={total > 0 ? `${Math.round((completed / total) * 100)}% done` : "—"}
          icon={CheckCircle2}
          accent="bg-emerald-500"
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          sub="Active right now"
          icon={TrendingUp}
          accent="bg-blue-500"
        />
        <StatCard
          label="Remaining"
          value={pending + notStarted}
          sub="Needs attention"
          icon={Bell}
          accent="bg-amber-500"
        />
      </div>

      {/* ─── CALENDAR WEEK STRIP ──────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              {format(weekAnchor, "MMMM yyyy")}
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
              Select a date to view tasks
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setWeekAnchor((d) => addDays(d, -7))}
              className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setWeekAnchor(new Date()); setSelectedDate(todayStr); }}
              className="text-[9px] font-bold text-primary bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 px-2.5 py-1.5 rounded-full transition-all"
            >
              Today
            </button>
            <button
              onClick={() => setWeekAnchor((d) => addDays(d, 7))}
              className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const dayStr = format(day, "yyyy-MM-dd");
            const isSelected = dayStr === selectedDate;
            const isToday = dayStr === todayStr;
            const isFuture = day > new Date();

            return (
              <button
                key={dayStr}
                onClick={() => !isFuture && setSelectedDate(dayStr)}
                disabled={isFuture}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-200 relative
                  ${isSelected
                    ? "bg-primary text-white shadow-md shadow-blue-200/50 dark:shadow-blue-900/40 scale-105"
                    : isToday
                    ? "bg-blue-50 dark:bg-blue-950/30 text-primary font-bold"
                    : isFuture
                    ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  }`}
              >
                <span className="text-[9px] font-bold uppercase">
                  {format(day, "EEE")}
                </span>
                <span className={`text-sm mt-0.5 ${isSelected ? "font-extrabold" : "font-semibold"}`}>
                  {format(day, "d")}
                </span>
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TASK SECTION ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              {isReadOnly ? "Tasks on" : "Today's Tasks"}
              {isReadOnly && (
                <span className="ml-2 text-primary font-bold">
                  {format(parseISO(selectedDate), "MMM dd")}
                </span>
              )}
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              {total} task{total !== 1 ? "s" : ""} assigned
              {isReadOnly && " · Read-only view"}
            </p>
          </div>
          {isReadOnly && (
            <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-400 px-2.5 py-1.5 rounded-full">
              Past date
            </span>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all shrink-0
                ${activeFilter === opt.value
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
            >
              {opt.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold
                ${activeFilter === opt.value
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                {opt.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Hero cards (first 2) */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.slice(0, 2).map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                isReadOnly={isReadOnly}
                onClick={() => !isReadOnly && handleUpdateClick(task)}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Remaining task list */}
        {!isLoading && filtered.length > 2 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                More Tasks
              </span>
            </div>
            {filtered.slice(2).map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                isReadOnly={isReadOnly}
                onClick={() => !isReadOnly && handleUpdateClick(task)}
                index={i + 2}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-7 h-7 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {activeFilter === "ALL"
                ? "No tasks assigned for this day"
                : `No ${activeFilter.replace("_", " ").toLowerCase()} tasks`}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              {activeFilter !== "ALL"
                ? "Try switching to All to see all tasks."
                : "Check back later or contact your manager."}
            </p>
            {activeFilter !== "ALL" && (
              <button
                onClick={() => setActiveFilter("ALL")}
                className="mt-4 text-xs font-bold text-primary bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 px-4 py-2 rounded-full transition-all"
              >
                View All Tasks
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─── TASK STATUS MODAL ────────────────────────────────────────── */}
      <TaskStatusModal
        task={activeTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
