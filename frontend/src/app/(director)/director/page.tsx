"use client";

import React from "react";
import { BarChart2, TrendingUp, Users, CheckCircle, Target, Briefcase } from "lucide-react";
import { Card } from "../../../components/ui/Card";

export default function DirectorPage() {
  const cards = [
    { title: "Total Headcount", value: "24", desc: "Across 4 active departments", icon: Users, color: "text-primary" },
    { title: "Task Completion Index", value: "94.2%", desc: "+1.2% this week", icon: CheckCircle, color: "text-emerald-600" },
    { title: "Average Attendance", value: "97.5%", desc: "98% target punch achieved", icon: Target, color: "text-amber-500" },
    { title: "Active Initiatives", value: "8", desc: "On course milestones", icon: Briefcase, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto min-h-screen">
      {/* Top Welcome Title */}
      <Card variant="flat" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-0.5">
            Executive Analytics Command
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Review organization statistics, output velocities, and project timelines
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full shrink-0">
          <BarChart2 className="w-4 h-4 text-primary" />
          <span className="font-sans text-xs font-bold text-primary">
            Board-Level Oversight
          </span>
        </div>
      </Card>

      {/* Grid of Key stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, index) => {
          const Icon = c.icon;
          return (
            <Card key={index} variant="flat" padding="sm" className="flex flex-col justify-between h-[110px]">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {c.title}
                </span>
                <Icon className={`w-4 h-4 ${c.color} shrink-0`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${c.color} leading-none mb-1`}>
                  {c.value}
                </div>
                <span className="text-[10px] font-semibold text-slate-400 block">
                  {c.desc}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart Widget - 8 Columns */}
        <Card variant="flat" className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="font-sans text-sm font-bold text-slate-700 uppercase tracking-wider">
                Monthly Task Completion Trend (2026)
              </h3>
            </div>

            {/* Custom SVG area chart */}
            <div className="w-full h-[220px] relative pt-4 pr-4">
              <svg className="w-full h-[180px]" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3A9DE9" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3A9DE9" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="5,5" />

                {/* Filled Area */}
                <path
                  d="M 0 150 L 0 110 L 100 98 L 200 65 L 300 45 L 400 35 L 500 20 L 500 150 Z"
                  fill="url(#chart-grad)"
                />

                {/* Line Path */}
                <path
                  d="M 0 110 L 100 98 L 200 65 L 300 45 L 400 35 L 500 20"
                  fill="none"
                  stroke="#3A9DE9"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Nodes */}
                <circle cx="0" cy="110" r="4.5" fill="#3A9DE9" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="100" cy="98" r="4.5" fill="#3A9DE9" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="200" cy="65" r="4.5" fill="#3A9DE9" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="300" cy="45" r="4.5" fill="#3A9DE9" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="400" cy="35" r="4.5" fill="#3A9DE9" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="500" cy="20" r="4.5" fill="#3A9DE9" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>

              {/* Labels below chart */}
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 pt-1.5 border-t border-slate-100/50 mt-1">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-center text-xs font-semibold text-slate-400">
            📊 Overall milestones success percentage: <span className="text-primary font-bold">96.8%</span>
          </div>
        </Card>

        {/* Project distribution stats - 4 Columns */}
        <Card variant="flat" className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Briefcase className="w-4 h-4 text-primary" />
              <h3 className="font-sans text-sm font-bold text-slate-700 uppercase tracking-wider">
                Initiatives Share
              </h3>
            </div>

            {/* Distribution metrics */}
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>HPS Platform Core</span>
                  <span className="text-primary">45%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-primary h-full rounded-full" style={{ width: "45%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Mobile PWA Refactor</span>
                  <span className="text-purple-600">30%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-50 h-full rounded-full" style={{ width: "30%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Authentication Setup</span>
                  <span className="text-emerald-600">25%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "25%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-100">
            Live Project Allotment
          </div>
        </Card>
      </div>
    </div>
  );
}
