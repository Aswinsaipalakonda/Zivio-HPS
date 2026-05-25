"use client";

import React, { useState } from "react";
import {
  Search,
  Sliders,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Circle,
  TrendingUp,
  ListChecks,
  Timer,
  AlertOctagon,
  ChevronDown,
} from "lucide-react";
import { Card } from "../../../../components/ui/Card";

/* ------------------------------------------------------------------ */
/* Types & Mock Data                                                   */
/* ------------------------------------------------------------------ */
interface ReviewTask {
  id: string;
  title: string;
  assigneeName: string;
  assigneeAvatar: string;
  assigneeDept: string;
  dueDate: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Completed" | "In Progress" | "Pending" | "Overdue";
  completion: number;
}

const TASKS: ReviewTask[] = [
  {
    id: "1",
    title: "Design Payment Gateway UI",
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "BS",
    assigneeDept: "Design",
    dueDate: "May 25, 2026",
    priority: "Critical",
    status: "Completed",
    completion: 100,
  },
  {
    id: "2",
    title: "Write API Router Documentation",
    assigneeName: "Jerome Bell",
    assigneeAvatar: "JB",
    assigneeDept: "Content",
    dueDate: "May 26, 2026",
    priority: "High",
    status: "In Progress",
    completion: 65,
  },
  {
    id: "3",
    title: "Review Help Desk Tickets",
    assigneeName: "Marvin McKinney",
    assigneeAvatar: "MM",
    assigneeDept: "Support",
    dueDate: "May 25, 2026",
    priority: "Medium",
    status: "Completed",
    completion: 100,
  },
  {
    id: "4",
    title: "Draft Marketing Landing Page Copy",
    assigneeName: "Darlene Robertson",
    assigneeAvatar: "DR",
    assigneeDept: "Content",
    dueDate: "May 24, 2026",
    priority: "High",
    status: "Overdue",
    completion: 30,
  },
  {
    id: "5",
    title: "Refactor Database User Tables",
    assigneeName: "Guy Hawkins",
    assigneeAvatar: "GH",
    assigneeDept: "Engineering",
    dueDate: "May 27, 2026",
    priority: "Critical",
    status: "In Progress",
    completion: 72,
  },
  {
    id: "6",
    title: "Run Regression Test Suite",
    assigneeName: "Kristin Watson",
    assigneeAvatar: "KW",
    assigneeDept: "QA",
    dueDate: "May 28, 2026",
    priority: "Medium",
    status: "Pending",
    completion: 0,
  },
  {
    id: "7",
    title: "Create Onboarding Flow Mockups",
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "BS",
    assigneeDept: "Design",
    dueDate: "May 22, 2026",
    priority: "Low",
    status: "Completed",
    completion: 100,
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const priorityStyles: Record<string, string> = {
  Critical: "bg-red-50 text-red-700 border-red-100",
  High: "bg-orange-50 text-orange-700 border-orange-100",
  Medium: "bg-amber-50 text-amber-700 border-amber-100",
  Low: "bg-slate-50 text-slate-600 border-slate-200",
};

const statusIcon: Record<string, React.ReactNode> = {
  Completed: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  "In Progress": <Clock className="w-3.5 h-3.5 text-blue-500" />,
  Pending: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  Overdue: <AlertOctagon className="w-3.5 h-3.5 text-red-500" />,
};

const statusStyles: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Overdue: "bg-red-50 text-red-700 border-red-100",
};

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function ManagerTasksReviewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const totalAssigned = TASKS.length;
  const completedCount = TASKS.filter((t) => t.status === "Completed").length;
  const inProgressCount = TASKS.filter((t) => t.status === "In Progress").length;
  const overdueCount = TASKS.filter((t) => t.status === "Overdue").length;

  const filtered = TASKS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total Assigned", value: totalAssigned, icon: ListChecks, color: "text-[#3A9DE9]", bg: "bg-blue-50" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "In Progress", value: inProgressCount, icon: Timer, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Overdue", value: overdueCount, icon: AlertOctagon, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ============================================================ */}
      {/* DESKTOP VIEW                                                  */}
      {/* ============================================================ */}
      <div className="hidden lg:block space-y-6">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Task Review Panel</h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Monitor team progress, review blockers, and track deliverable completion
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-10 px-4 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs font-bold text-slate-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>View Trends</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="flat" padding="sm" className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {stat.label}
                </span>
                <span className="text-xl font-bold text-slate-800">{stat.value}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Table Card */}
        <Card variant="flat" padding="none" className="overflow-hidden border border-slate-100 shadow-sm bg-white rounded-2xl">
          {/* Filter Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-3 flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4" />
              <input
                type="text"
                placeholder="Search tasks or team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 text-xs font-medium text-slate-700 outline-none focus:border-[#3A9DE9] focus:bg-white focus:ring-1 focus:ring-[#3A9DE9] transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="h-10 px-4 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs font-bold text-slate-600">
                <Sliders className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-4 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600 outline-none cursor-pointer bg-white"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
              <button className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-400 hover:text-slate-600">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Count */}
          <div className="px-6 py-3.5 border-b border-slate-50 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Showing {filtered.length} of {TASKS.length} tasks
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 pl-6 w-12">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  <th className="py-4 px-4">Task</th>
                  <th className="py-4 px-4 w-48">Assigned To</th>
                  <th className="py-4 px-4 w-28">Due Date</th>
                  <th className="py-4 px-4 w-24 text-center">Priority</th>
                  <th className="py-4 px-4 w-28 text-center">Status</th>
                  <th className="py-4 px-4 pr-6 w-36 text-center">Completion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="py-4 pl-6">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-[#3A9DE9] transition-colors">
                        {task.title}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3A9DE9] to-blue-400 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                          {task.assigneeAvatar}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-slate-700 truncate">{task.assigneeName}</span>
                          <span className="block text-[10px] text-slate-400 font-semibold">{task.assigneeDept}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-bold text-slate-400">{task.dueDate}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusStyles[task.status]}`}>
                        {statusIcon[task.status]}
                        {task.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 pr-6">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              task.completion === 100
                                ? "bg-emerald-500"
                                : task.completion >= 60
                                ? "bg-blue-500"
                                : task.completion >= 30
                                ? "bg-amber-500"
                                : "bg-slate-300"
                            }`}
                            style={{ width: `${task.completion}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-500 w-8 text-right">{task.completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-500">No tasks found</h4>
              <p className="text-xs text-slate-400 mt-1">Adjust your search or filter criteria.</p>
            </div>
          )}
        </Card>
      </div>

      {/* ============================================================ */}
      {/* MOBILE VIEW                                                   */}
      {/* ============================================================ */}
      <div className="block lg:hidden space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Task Review Panel</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            Monitor progress & review deliverables
          </p>
        </div>

        {/* Mobile Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} variant="flat" padding="sm" className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                  {stat.label}
                </span>
                <span className="text-lg font-bold text-slate-800">{stat.value}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-medium text-slate-700 outline-none focus:border-[#3A9DE9] focus:ring-1 focus:ring-[#3A9DE9] transition-all shadow-sm"
          />
        </div>

        {/* Mobile Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["All", "In Progress", "Completed", "Pending", "Overdue"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                statusFilter === s
                  ? "bg-[#3A9DE9] text-white border-[#3A9DE9]"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Mobile Task Cards */}
        <div className="space-y-3">
          {filtered.map((task) => (
            <Card key={task.id} variant="flat" padding="sm" className="border border-slate-100">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-sm font-bold text-slate-800 flex-1">{task.title}</h4>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider shrink-0 ${statusStyles[task.status]}`}>
                  {statusIcon[task.status]}
                  {task.status}
                </span>
              </div>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3A9DE9] to-blue-400 flex items-center justify-center text-white text-[8px] font-bold shrink-0">
                  {task.assigneeAvatar}
                </div>
                <span className="text-xs text-slate-500 font-semibold">{task.assigneeName}</span>
                <span className="text-[10px] text-slate-300">•</span>
                <span className="text-[10px] text-slate-400 font-semibold">{task.dueDate}</span>
              </div>

              {/* Completion bar */}
              <div className="flex items-center gap-2.5 pt-2.5 border-t border-slate-100">
                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      task.completion === 100
                        ? "bg-emerald-500"
                        : task.completion >= 60
                        ? "bg-blue-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${task.completion}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500">{task.completion}%</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${priorityStyles[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-500">No results found</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
