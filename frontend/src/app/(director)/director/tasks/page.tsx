"use client";

import React, { useState } from "react";
import { Filter, ShieldCheck } from "lucide-react";
import { Card } from "../../../../components/ui/Card";
import { Avatar } from "../../../../components/ui/Avatar";
import { Badge } from "../../../../components/ui/Badge";

interface OrgTask {
  id: string;
  title: string;
  assignee: string;
  role: string;
  department: "Software Engineering" | "Delivery & Operations" | "General Administration";
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "NOT_STARTED";
  dueDate: string;
  description: string;
  blocker?: string;
}

export default function DirectorTasksPage() {
  const [deptFilter, setDeptFilter] = useState<string>("ALL");

  const orgTasks: OrgTask[] = [
    {
      id: "1",
      title: "Design Payment Gateway UI",
      assignee: "Brooklyn Simmons",
      role: "Product Designer",
      department: "Delivery & Operations",
      status: "COMPLETED",
      dueDate: "May 25, 2026",
      description: "Draft modern checkout templates, responsive card forms, and error panels for checkout dashboards.",
    },
    {
      id: "2",
      title: "Integrate Clerk JWT Middleware",
      assignee: "Guy Hawkins",
      role: "Software Engineer",
      department: "Software Engineering",
      status: "IN_PROGRESS",
      dueDate: "May 27, 2026",
      description: "Wire backend auth verify endpoints to retrieve Clerk session tokens and cache JWKS keys with a 1-hour TTL.",
    },
    {
      id: "3",
      title: "Write API Router Documentation",
      assignee: "Jerome Bell",
      role: "Content Writer",
      department: "Delivery & Operations",
      status: "IN_PROGRESS",
      dueDate: "May 26, 2026",
      description: "Publish standard markdown reference endpoints for Django users and profile attendance mappings.",
    },
    {
      id: "4",
      title: "Dockerize PostgreSQL Database",
      assignee: "Aswin (Superadmin)",
      role: "Lead DevOps",
      department: "Software Engineering",
      status: "COMPLETED",
      dueDate: "May 25, 2026",
      description: "Declare Postgres 16 container, configure custom volume mounts, and wire core migrations scripts.",
    },
    {
      id: "5",
      title: "Establish Legal Tax Forms Manifest",
      assignee: "Courtney Henry",
      role: "Finance Director",
      department: "General Administration",
      status: "PENDING",
      dueDate: "May 28, 2026",
      description: "Consolidate W-2 and contract invoice forms. Currently waiting on tax advisors document parameters release.",
      blocker: "Awaiting legal advisor template approvals.",
    },
  ];

  const filteredTasks = deptFilter === "ALL" 
    ? orgTasks 
    : orgTasks.filter(t => t.department === deptFilter);

  const getStatusBorder = (status: string) => {
    switch (status) {
      case "COMPLETED": return "border-l-emerald-500";
      case "IN_PROGRESS": return "border-l-blue-500";
      case "PENDING": return "border-l-amber-500";
      default: return "border-l-slate-400";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto min-h-screen">
      {/* Top Welcome Title */}
      <Card variant="flat" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-0.5">
            Enterprise Deliverables Oversight
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Review live active tasks progress across all organizational departments
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-700 outline-none border-0 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Delivery & Operations">Delivery & Operations</option>
            <option value="General Administration">General Administration</option>
          </select>
        </div>
      </Card>

      {/* Checklist list */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card 
            key={task.id}
            variant="flat" 
            className={`border-l-4 transition-all ${getStatusBorder(task.status)}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex gap-3">
                <Avatar name={task.assignee} size="sm" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    Assigned to <span className="text-slate-600 font-bold">{task.assignee}</span> ({task.role})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-full">
                  {task.department}
                </span>
                <Badge status={task.status} />
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              {task.description}
            </p>

            {task.blocker && (
              <div className="mt-3.5 bg-red-50/50 border border-red-100 p-3 rounded-xl flex items-start gap-2">
                <span className="text-[10px] font-bold text-red-700 bg-red-100 border border-red-200/50 px-1.5 py-0.5 rounded uppercase tracking-wider block shrink-0 mt-0.5">
                  Blocker
                </span>
                <p className="text-xs text-red-600 font-sans italic leading-relaxed">
                  "{task.blocker}"
                </p>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-[11px] font-semibold text-slate-400">
              <span>Target Finish: {task.dueDate}</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Deliverable</span>
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
