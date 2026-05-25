"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, AlertCircle, Clock, Calendar, CheckCircle2, Sliders } from "lucide-react";
import { Card } from "../../../../components/ui/Card";

export default function ManagerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("This Week");

  // Mock department metrics
  const completionRate = 91.5;
  const activeMembersCount = 5;
  const totalMembersCount = 6;
  const blockedTasksCount = 1;
  const pendingReviewsCount = 3;

  // Mock chart data (SVG coords calculation)
  const taskVelocityData = [
    { day: "Mon", allocated: 4, completed: 3 },
    { day: "Tue", allocated: 6, completed: 4 },
    { day: "Wed", allocated: 5, completed: 5 },
    { day: "Thu", allocated: 8, completed: 6 },
    { day: "Fri", allocated: 7, completed: 7 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto min-h-screen font-sans">
      {/* Top Welcome Title */}
      <Card variant="flat" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-0.5">
            Department Analytics
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Track team task velocity, allocation rates, and performance statistics
          </p>
        </div>

        {/* Time Filter Dropdown */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm shrink-0">
          <Sliders className="w-4 h-4 text-slate-400" />
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-700 outline-none border-0 cursor-pointer"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Quarter">This Quarter</option>
          </select>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card variant="flat" className="p-5 flex flex-col justify-between border border-slate-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Completion Rate
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              {completionRate}%
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider mt-1.5 inline-block">
              +4.2% vs last week
            </span>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card variant="flat" className="p-5 flex flex-col justify-between border border-slate-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Allocations
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#3A9DE9] border border-blue-100">
              <BarChart3 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              {activeMembersCount} / {totalMembersCount}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
              Team members allocated
            </p>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card variant="flat" className="p-5 flex flex-col justify-between border border-slate-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Blocked Tasks
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              {blockedTasksCount}
            </h3>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-wider mt-1.5 inline-block">
              1 team review needed
            </span>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card variant="flat" className="p-5 flex flex-col justify-between border border-slate-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Reviews Pending
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              {pendingReviewsCount}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
              Waiting for check-off
            </p>
          </div>
        </Card>
      </div>

      {/* Custom Premium SVG Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Task Velocity Area Chart */}
        <Card variant="flat" className="lg:col-span-2 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Weekly Task Velocity</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Tasks allocated vs. tasks completed per day
              </p>
            </div>
            {/* Legend */}
            <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#3A9DE9] inline-block" />
                <span>Allocated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                <span>Completed</span>
              </div>
            </div>
          </div>

          {/* SVG Area Chart Container */}
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Day Labels */}
              {taskVelocityData.map((d, index) => {
                const x = 50 + index * 100;
                return (
                  <text
                    key={d.day}
                    x={x}
                    y="196"
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-slate-400 uppercase tracking-wider"
                  >
                    {d.day}
                  </text>
                );
              })}

              {/* Area 1: Allocated (Light Blue fill + Blue Line) */}
              {/* Path coordinates: Mon(50, 140), Tue(150, 110), Wed(250, 125), Thu(350, 80), Fri(450, 95) */}
              <path
                d="M 50 180 L 50 140 L 150 110 L 250 125 L 350 80 L 450 95 L 450 180 Z"
                fill="url(#allocatedGrad)"
                opacity="0.15"
              />
              <path
                d="M 50 140 L 150 110 L 250 125 L 350 80 L 450 95"
                fill="none"
                stroke="#3A9DE9"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Area 2: Completed (Light Green fill + Green Line) */}
              {/* Path coordinates: Mon(50, 155), Tue(150, 140), Wed(250, 125), Thu(350, 110), Fri(450, 95) */}
              <path
                d="M 50 180 L 50 155 L 150 140 L 250 125 L 350 110 L 450 95 L 450 180 Z"
                fill="url(#completedGrad)"
                opacity="0.15"
              />
              <path
                d="M 50 155 L 150 140 L 250 125 L 350 110 L 450 95"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dots on nodes */}
              {taskVelocityData.map((d, index) => {
                const x = 50 + index * 100;
                // Coords mapping
                const yAlloc = d.day === "Mon" ? 140 : d.day === "Tue" ? 110 : d.day === "Wed" ? 125 : d.day === "Thu" ? 80 : 95;
                const yComp = d.day === "Mon" ? 155 : d.day === "Tue" ? 140 : d.day === "Wed" ? 125 : d.day === "Thu" ? 110 : 95;

                return (
                  <g key={d.day}>
                    <circle cx={x} cy={yAlloc} r="4" className="fill-white stroke-[#3A9DE9]" strokeWidth="2.5" />
                    <circle cx={x} cy={yComp} r="4" className="fill-white stroke-[#10B981]" strokeWidth="2.5" />
                  </g>
                );
              })}

              {/* Gradients declarations */}
              <defs>
                <linearGradient id="allocatedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3A9DE9" />
                  <stop offset="100%" stopColor="#3A9DE9" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </Card>

        {/* Task Status Distribution Donut Chart */}
        <Card variant="flat" className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Task State Share</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Breakdown of ongoing task statuses
            </p>
          </div>

          <div className="relative flex justify-center items-center h-44 my-4">
            <svg width="150" height="150" viewBox="0 0 42 42" className="transform -rotate-90">
              <circle cx="21" cy="21" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
              
              {/* Completed: 50% (dasharray: 50 50, dashoffset 0) */}
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke="#10B981"
                strokeWidth="4.5"
                strokeDasharray="50 50"
                strokeDashoffset="0"
              />
              
              {/* In Progress: 30% (dasharray: 30 70, dashoffset -50) */}
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke="#3A9DE9"
                strokeWidth="4.5"
                strokeDasharray="30 70"
                strokeDashoffset="-50"
              />

              {/* Pending: 15% (dasharray: 15 85, dashoffset -80) */}
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="4.5"
                strokeDasharray="15 85"
                strokeDashoffset="-80"
              />

              {/* Not Started: 5% (dasharray: 5 95, dashoffset -95) */}
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="4.5"
                strokeDasharray="5 95"
                strokeDashoffset="-95"
              />
            </svg>

            {/* Inner Absolute Label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-slate-800">14</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                Total Tasks
              </span>
            </div>
          </div>

          {/* Color Labels Grid */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-emerald-500 shrink-0" />
              <span className="truncate">Completed (50%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#3A9DE9] shrink-0" />
              <span className="truncate">Active (30%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-amber-500 shrink-0" />
              <span className="truncate">Pending (15%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-slate-400 shrink-0" />
              <span className="truncate">Unstarted (5%)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Task Performance Rankings */}
      <Card variant="flat" padding="none" className="overflow-hidden border border-slate-100 shadow-sm bg-white rounded-2xl">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Weekly Team Standings</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Task velocity indexes and performance rates of active members
            </p>
          </div>
          <Calendar className="w-4 h-4 text-slate-400" />
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { name: "Brooklyn Simmons", role: "Product Designer", tasks: 8, completed: 8, efficiency: "98%" },
            { name: "Guy Hawkins", role: "Software Engineer", tasks: 6, completed: 5, efficiency: "97%" },
            { name: "Marvin McKinney", role: "Support Manager", tasks: 5, completed: 5, efficiency: "95%" },
            { name: "Kristin Watson", role: "QA Engineer", tasks: 4, completed: 3, efficiency: "91%" },
            { name: "Jerome Bell", role: "Content Writer", tasks: 5, completed: 4, efficiency: "88%" },
          ].map((item, idx) => (
            <div key={item.name} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div className="text-xs">
                  <span className="block text-slate-800 font-bold">{item.completed}/{item.tasks} Tasks</span>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Completed</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" />
                    {item.efficiency}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
