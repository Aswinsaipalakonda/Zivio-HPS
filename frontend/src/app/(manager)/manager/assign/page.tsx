"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Sliders,
  ChevronDown,
  RefreshCw,
  FileText,
  MoreHorizontal,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Send,
  X,
} from "lucide-react";
import { Card } from "../../../../components/ui/Card";

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */
interface AssignedTask {
  id: string;
  date: string;
  assigneeName: string;
  assigneeAvatar: string;
  assigneeDept: string;
  title: string;
  description: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Completed" | "In Progress" | "Pending" | "Not Started";
}

const MOCK_TASKS: AssignedTask[] = [
  {
    id: "1",
    date: "May 25, 2026",
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "BS",
    assigneeDept: "Design",
    title: "Redesign Payment Invoice UI",
    description: "Draft responsive checkout interfaces with card validation & error states.",
    priority: "Critical",
    status: "In Progress",
  },
  {
    id: "2",
    date: "May 25, 2026",
    assigneeName: "Jerome Bell",
    assigneeAvatar: "JB",
    assigneeDept: "Content",
    title: "Write API Router Documentation",
    description: "Document Django user endpoints and profile attendance mapping reference.",
    priority: "High",
    status: "Completed",
  },
  {
    id: "3",
    date: "May 24, 2026",
    assigneeName: "Marvin McKinney",
    assigneeAvatar: "MM",
    assigneeDept: "Support",
    title: "Review Help Desk Tickets",
    description: "Address team tickets relating to login permissions and Superadmin access flows.",
    priority: "Medium",
    status: "Completed",
  },
  {
    id: "4",
    date: "May 24, 2026",
    assigneeName: "Darlene Robertson",
    assigneeAvatar: "DR",
    assigneeDept: "Content",
    title: "Draft Marketing Landing Page Copy",
    description: "Write conversion-oriented headlines and feature card descriptions for launch.",
    priority: "High",
    status: "Pending",
  },
  {
    id: "5",
    date: "May 23, 2026",
    assigneeName: "Guy Hawkins",
    assigneeAvatar: "GH",
    assigneeDept: "Engineering",
    title: "Refactor Database User Tables",
    description: "Migrate model fields to support unified User Profile model configurations.",
    priority: "Critical",
    status: "In Progress",
  },
  {
    id: "6",
    date: "May 23, 2026",
    assigneeName: "Kristin Watson",
    assigneeAvatar: "KW",
    assigneeDept: "QA",
    title: "Run Regression Test Suite",
    description: "Execute end-to-end browser tests across checkout, auth, and dashboard modules.",
    priority: "Medium",
    status: "Not Started",
  },
  {
    id: "7",
    date: "May 22, 2026",
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "BS",
    assigneeDept: "Design",
    title: "Create Onboarding Flow Mockups",
    description: "Design step-by-step onboarding wizard for new employee self-registration.",
    priority: "Low",
    status: "Completed",
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
  "Not Started": <Circle className="w-3.5 h-3.5 text-slate-400" />,
};

const statusStyles: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  "Not Started": "bg-slate-50 text-slate-500 border-slate-200",
};

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function ManagerAssignPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAssignDrawer, setShowAssignDrawer] = useState(false);

  // Assign form state
  const [newAssignee, setNewAssignee] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDue, setNewDue] = useState("2026-05-28");

  const filtered = MOCK_TASKS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ============================================================ */}
      {/* DESKTOP VIEW                                                  */}
      {/* ============================================================ */}
      <div className="hidden lg:block space-y-6">
        {/* Top Header Controls */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Task Allocation Board
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Assign, track, and manage team member deliverables
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="h-10 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs font-bold text-slate-600 bg-white">
              <FileText className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowAssignDrawer(true)}
              className="h-10 px-5 rounded-xl bg-[#3A9DE9] hover:bg-[#2480CC] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Task</span>
            </button>
          </div>
        </div>

        {/* Central Table Card */}
        <Card variant="flat" padding="none" className="overflow-hidden border border-slate-100 shadow-sm bg-white rounded-2xl">
          {/* Filter Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-3 flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4" />
              <input
                type="text"
                placeholder="Search tasks or assignees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 text-xs font-medium text-slate-700 outline-none focus:border-[#3A9DE9] focus:bg-white focus:ring-1 focus:ring-[#3A9DE9] transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="h-10 px-4.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] transition-all duration-200 flex items-center gap-2 text-xs font-bold text-slate-600 bg-white">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters</span>
              </button>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 pl-4 pr-8 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm transition-all duration-200 text-xs font-bold text-slate-600 outline-none cursor-pointer appearance-none bg-white min-w-[130px] active:scale-[0.98]"
                >
                  <option value="All">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Started">Not Started</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                }}
                className="w-10 h-10 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] transition-all duration-200 flex items-center justify-center text-slate-400 hover:text-slate-600 bg-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Count badge */}
          <div className="px-6 py-3.5 border-b border-slate-50 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total {filtered.length} allocated tasks
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 pl-6 w-12">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  <th className="py-4 px-4 w-24">Date</th>
                  <th className="py-4 px-4 w-52">Assignee</th>
                  <th className="py-4 px-4">Task Title & Description</th>
                  <th className="py-4 px-4 w-24 text-center">Priority</th>
                  <th className="py-4 px-4 w-28 text-center">Status</th>
                  <th className="py-4 px-4 pr-6 w-16 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="py-4 pl-6">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>
                    <td className="py-4 px-4 text-xs font-bold text-slate-400">
                      {task.date}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3A9DE9] to-blue-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {task.assigneeAvatar}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-sm font-bold text-slate-800 truncate">
                            {task.assigneeName}
                          </span>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {task.assigneeDept}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="min-w-0 max-w-xl">
                        <span className="block text-sm font-bold text-slate-800 group-hover:text-[#3A9DE9] transition-colors mb-0.5 truncate">
                          {task.title}
                        </span>
                        <span className="block text-xs text-slate-400 leading-relaxed line-clamp-1">
                          {task.description}
                        </span>
                      </div>
                    </td>
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
                    <td className="py-4 px-4 pr-6 text-center">
                      <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors mx-auto">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-500">No tasks match your criteria</h4>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </Card>
      </div>

      {/* ============================================================ */}
      {/* MOBILE VIEW                                                   */}
      {/* ============================================================ */}
      <div className="block lg:hidden space-y-5">
        {/* Mobile Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Task Allocation Board</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
            Assign & manage team deliverables
          </p>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowAssignDrawer(true)}
            className="flex-1 h-10 rounded-xl bg-[#3A9DE9] hover:bg-[#2480CC] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Task</span>
          </button>
          <button className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs font-bold text-slate-600 bg-white">
            <FileText className="w-4 h-4" />
            <span>Export</span>
          </button>
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
          {["All", "In Progress", "Completed", "Pending", "Not Started"].map((s) => (
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
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3A9DE9] to-blue-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {task.assigneeAvatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{task.assigneeName}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {task.assigneeDept}
                    </span>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider shrink-0 ${priorityStyles[task.priority]}`}>
                  {task.priority}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-800 mb-0.5">{task.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400">{task.date}</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusStyles[task.status]}`}>
                  {statusIcon[task.status]}
                  {task.status}
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

      {/* ============================================================ */}
      {/* ASSIGN TASK SLIDE-OVER DRAWER                                 */}
      {/* ============================================================ */}
      {showAssignDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={() => setShowAssignDrawer(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white border-l border-slate-100 shadow-2xl h-full flex flex-col p-6 sm:p-8">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A9DE9] block">
                  New Assignment
                </span>
                <h3 className="text-lg font-bold text-slate-800">Assign Task</h3>
              </div>
              <button
                onClick={() => setShowAssignDrawer(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form
              className="flex-1 space-y-4 overflow-y-auto"
              onSubmit={(e) => {
                e.preventDefault();
                setShowAssignDrawer(false);
              }}
            >
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Assignee
                </label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="bg-white border border-slate-200 text-sm rounded-xl w-full h-11 text-slate-800 focus:border-[#3A9DE9] focus:ring-1 focus:ring-[#3A9DE9] outline-none px-3.5 transition-all"
                >
                  <option value="">Select team member...</option>
                  <option value="Brooklyn Simmons">Brooklyn Simmons</option>
                  <option value="Jerome Bell">Jerome Bell</option>
                  <option value="Marvin McKinney">Marvin McKinney</option>
                  <option value="Darlene Robertson">Darlene Robertson</option>
                  <option value="Guy Hawkins">Guy Hawkins</option>
                  <option value="Kristin Watson">Kristin Watson</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Redesign Payment Invoice UI"
                  className="bg-white border border-slate-200 text-sm rounded-xl w-full h-11 text-slate-800 focus:border-[#3A9DE9] focus:ring-1 focus:ring-[#3A9DE9] outline-none px-3.5 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the task scope, deliverables, and references..."
                  rows={4}
                  className="bg-white border border-slate-200 text-sm rounded-xl w-full p-3.5 text-slate-800 focus:border-[#3A9DE9] focus:ring-1 focus:ring-[#3A9DE9] outline-none resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="bg-white border border-slate-200 text-sm rounded-xl w-full h-11 text-slate-800 focus:border-[#3A9DE9] focus:ring-1 focus:ring-[#3A9DE9] outline-none px-3.5 transition-all"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                    className="bg-white border border-slate-200 text-sm rounded-xl w-full h-11 text-slate-800 focus:border-[#3A9DE9] focus:ring-1 focus:ring-[#3A9DE9] outline-none px-3.5 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#3A9DE9] hover:bg-[#2480CC] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Allocate Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
