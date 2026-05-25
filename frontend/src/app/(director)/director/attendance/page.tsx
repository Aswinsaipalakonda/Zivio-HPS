"use client";

import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { Filter, CheckCircle2, Clock, XCircle, HelpCircle } from "lucide-react";
import { Card } from "../../../../components/ui/Card";
import { Avatar } from "../../../../components/ui/Avatar";

interface AttendanceRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  weekStatus: Record<string, "PRESENT" | "LATE" | "ABSENT" | "UNLOGGED">;
}

export default function DirectorAttendancePage() {
  const [deptFilter, setDeptFilter] = useState<string>("ALL");

  const weekStart = new Date(2026, 4, 25); // May 25, 2026
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(weekStart, i));

  const employeeAttendance: AttendanceRecord[] = [
    {
      id: "1",
      name: "Brooklyn Simmons",
      role: "Product Designer",
      department: "Delivery & Operations",
      weekStatus: { "2026-05-25": "PRESENT", "2026-05-26": "PRESENT", "2026-05-27": "LATE", "2026-05-28": "PRESENT", "2026-05-29": "PRESENT" }
    },
    {
      id: "2",
      name: "Jerome Bell",
      role: "Content Writer",
      department: "Delivery & Operations",
      weekStatus: { "2026-05-25": "PRESENT", "2026-05-26": "LATE", "2026-05-27": "PRESENT", "2026-05-28": "PRESENT", "2026-05-29": "PRESENT" }
    },
    {
      id: "3",
      name: "Marvin McKinney",
      role: "Support Manager",
      department: "Delivery & Operations",
      weekStatus: { "2026-05-25": "PRESENT", "2026-05-26": "PRESENT", "2026-05-27": "PRESENT", "2026-05-28": "PRESENT", "2026-05-29": "PRESENT" }
    },
    {
      id: "4",
      name: "Guy Hawkins",
      role: "Software Engineer",
      department: "Software Engineering",
      weekStatus: { "2026-05-25": "PRESENT", "2026-05-26": "PRESENT", "2026-05-27": "PRESENT", "2026-05-28": "PRESENT", "2026-05-29": "LATE" }
    },
    {
      id: "5",
      name: "Darlene Robertson",
      role: "Content Writer",
      department: "Delivery & Operations",
      weekStatus: { "2026-05-25": "ABSENT", "2026-05-26": "PRESENT", "2026-05-27": "PRESENT", "2026-05-28": "PRESENT", "2026-05-29": "PRESENT" }
    },
    {
      id: "6",
      name: "Kristin Watson",
      role: "QA Engineer",
      department: "Software Engineering",
      weekStatus: { "2026-05-25": "PRESENT", "2026-05-26": "PRESENT", "2026-05-27": "ABSENT", "2026-05-28": "PRESENT", "2026-05-29": "PRESENT" }
    }
  ];

  const filteredRecords = deptFilter === "ALL"
    ? employeeAttendance
    : employeeAttendance.filter(r => r.department === deptFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "LATE":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "ABSENT":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "UNLOGGED":
      default:
        return <HelpCircle className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto min-h-screen">
      {/* Top Header Card */}
      <Card variant="flat" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-0.5">
            Enterprise Attendance Log
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Review company check-in states and attendance schedules
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
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
            </select>
          </div>
        </div>
      </Card>

      {/* Main Matrix Table */}
      <Card variant="flat" className="overflow-hidden p-0 border border-slate-100 shadow-sm">
        {/* Table Header Row */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex-1 max-w-[240px]">Team Member</div>
          <div className="flex-1 flex justify-around text-center max-w-[480px]">
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="w-16">
                <span className="block text-slate-400">{format(day, "eee")}</span>
                <span className="block text-[10px] text-slate-500 font-bold mt-0.5">{format(day, "dd MMM")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table Body rows */}
        <div className="divide-y divide-slate-100">
          {filteredRecords.map((record) => (
            <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
              {/* Employee brief card */}
              <div className="flex-1 max-w-[240px] flex items-center gap-3">
                <Avatar name={record.name} size="sm" />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">
                    {record.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {record.role}
                  </p>
                </div>
              </div>

              {/* Weekly Status Indicator column nodes */}
              <div className="flex-1 flex justify-around items-center max-w-[480px]">
                {weekDays.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const status = record.weekStatus[dateStr] || "UNLOGGED";

                  return (
                    <div key={dateStr} className="w-16 flex justify-center items-center h-10 cursor-pointer" title={`${record.name}: ${status}`}>
                      {getStatusIcon(status)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Legend Indicator footer */}
      <Card variant="flat" padding="sm" className="flex flex-wrap gap-6 justify-center text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Present check-in log resolved</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Late check-in log resolved</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-500" />
          <span>Absent/No attendance log</span>
        </div>
      </Card>
    </div>
  );
}
