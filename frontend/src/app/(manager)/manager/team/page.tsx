"use client";

import React from "react";
import { Users, Mail, Star } from "lucide-react";
import { Card } from "../../../../components/ui/Card";
import { Avatar } from "../../../../components/ui/Avatar";

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  performance: "EXCELLENT" | "GOOD" | "AVERAGE" | "NEEDS_IMPROVEMENT";
  joinedDate: string;
  taskCompletionRate: number;
}

export default function ManagerTeamPage() {
  const teamMembers: Member[] = [
    { id: "1", name: "Brooklyn Simmons", role: "Product Designer", email: "brooklyn@fillo.com", department: "Delivery & Operations", performance: "EXCELLENT", joinedDate: "Jan 12, 2025", taskCompletionRate: 98 },
    { id: "2", name: "Jerome Bell", role: "Content Writer", email: "jerome@fillo.com", department: "Delivery & Operations", performance: "GOOD", joinedDate: "Feb 18, 2025", taskCompletionRate: 88 },
    { id: "3", name: "Marvin McKinney", role: "Support Manager", email: "marvin@fillo.com", department: "Delivery & Operations", performance: "EXCELLENT", joinedDate: "Oct 05, 2024", taskCompletionRate: 95 },
    { id: "4", name: "Darlene Robertson", role: "Content Writer", email: "darlene@fillo.com", department: "Delivery & Operations", performance: "AVERAGE", joinedDate: "Nov 22, 2024", taskCompletionRate: 75 },
    { id: "5", name: "Guy Hawkins", role: "Software Engineer", email: "guy@fillo.com", department: "Delivery & Operations", performance: "EXCELLENT", joinedDate: "Dec 01, 2024", taskCompletionRate: 97 },
    { id: "6", name: "Kristin Watson", role: "QA Engineer", email: "kristin@fillo.com", department: "Delivery & Operations", performance: "GOOD", joinedDate: "Mar 10, 2025", taskCompletionRate: 91 },
  ];

  const getPerformanceBadge = (perf: string) => {
    switch (perf) {
      case "EXCELLENT":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "GOOD":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "AVERAGE":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "NEEDS_IMPROVEMENT":
      default:
        return "bg-red-50 text-red-700 border-red-100";
    }
  };

  const getPerformanceLabel = (perf: string) => {
    switch (perf) {
      case "EXCELLENT": return "Excellent 🔥";
      case "GOOD": return "Good 👍";
      case "AVERAGE": return "Average ⚡";
      case "NEEDS_IMPROVEMENT": return "Needs Work ⚠️";
      default: return perf;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto min-h-screen">
      {/* Top Welcome Title */}
      <Card variant="flat" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-0.5">
            Team Directory
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Review team contacts, joined timelines, and monthly completion indexes
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full shrink-0">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-sans text-xs font-bold text-primary">
            {teamMembers.length} Members
          </span>
        </div>
      </Card>

      {/* Grid of Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card
            key={member.id}
            variant="flat"
            className="flex flex-col justify-between border border-slate-100 p-6 hover:shadow-md transition-shadow"
          >
            <div>
              {/* Profile card row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} size="md" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {member.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-semibold">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Performance Pill */}
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${getPerformanceBadge(member.performance)}`}>
                  {getPerformanceLabel(member.performance)}
                </span>
              </div>

              {/* Information Row lists */}
              <div className="space-y-2 border-t border-slate-100 pt-3 mt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Star className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Joined: {member.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Performance task bar meter */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Task Completion</span>
                <span className="text-primary">{member.taskCompletionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${member.taskCompletionRate}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
