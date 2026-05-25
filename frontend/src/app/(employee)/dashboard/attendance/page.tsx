"use client";

import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2, Clock, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../../../../components/ui/Card";

interface AttendanceDay {
  date: string;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "LATE" | "UNLOGGED";
  checkIn?: string;
  checkOut?: string;
  hours?: number;
}

export default function EmployeeAttendancePage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate mock attendance logs for May 2026 to fit the timeline
  const getMockAttendance = (): Record<string, AttendanceDay> => {
    const data: Record<string, AttendanceDay> = {};
    const year = 2026;
    const month = 4; // May (0-indexed in JS Dates is May? No, 0 is Jan, 4 is May)
    
    // Add present days (Mon-Fri)
    for (let day = 1; day <= 31; day++) {
      const dateStr = `2026-05-${day.toString().padStart(2, "0")}`;
      const d = new Date(year, month, day);
      const dayOfWeek = d.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekends
        data[dateStr] = { date: dateStr, status: "UNLOGGED" };
      } else if (day === 4) {
        // Late day
        data[dateStr] = {
          date: dateStr,
          status: "LATE",
          checkIn: "09:34 AM",
          checkOut: "06:05 PM",
          hours: 8.5,
        };
      } else if (day === 12) {
        // Half day
        data[dateStr] = {
          date: dateStr,
          status: "HALF_DAY",
          checkIn: "09:02 AM",
          checkOut: "01:00 PM",
          hours: 4,
        };
      } else if (day === 22) {
        // Absent day
        data[dateStr] = {
          date: dateStr,
          status: "ABSENT",
        };
      } else if (day > 25) {
        // Future days
        data[dateStr] = { date: dateStr, status: "UNLOGGED" };
      } else {
        // Regular present day
        data[dateStr] = {
          date: dateStr,
          status: "PRESENT",
          checkIn: "08:58 AM",
          checkOut: "06:02 PM",
          hours: 9,
        };
      }
    }
    return data;
  };

  const attendanceData = getMockAttendance();

  // Calendar dates generation
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  // Fill in blanks for previous month prefix offset
  const blanks = Array(startDayOfWeek).fill(null);

  // Compute Statistics
  const workDays = Object.values(attendanceData).filter((d) => d.status !== "UNLOGGED");
  const presentCount = workDays.filter((d) => d.status === "PRESENT" || d.status === "LATE").length;
  const lateCount = workDays.filter((d) => d.status === "LATE").length;
  const halfDayCount = workDays.filter((d) => d.status === "HALF_DAY").length;
  const absentCount = workDays.filter((d) => d.status === "ABSENT").length;
  const rate = workDays.length ? Math.round(((presentCount + halfDayCount * 0.5) / workDays.length) * 100) : 100;

  const handlePrevMonth = () => {
    // Lock to May 2026 for preview consistency
  };

  const handleNextMonth = () => {
    // Lock to May 2026 for preview consistency
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "LATE":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "HALF_DAY":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "ABSENT":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-slate-300" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PRESENT": return "Present";
      case "LATE": return "Late";
      case "HALF_DAY": return "Half Day";
      case "ABSENT": return "Absent";
      default: return "-";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-4">
      {/* Top Header Card */}
      <Card variant="flat" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 dark:bg-slate-900 border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-0.5 font-sans">
            Attendance Log
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans">
            Review monthly work calendars and schedules
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm transition-colors duration-205">
          <button onClick={handlePrevMonth} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 disabled:opacity-30" disabled>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-sans text-sm font-bold text-slate-700 dark:text-slate-200 min-w-[100px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <button onClick={handleNextMonth} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 disabled:opacity-30" disabled>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="flat" padding="sm" className="text-center dark:bg-slate-900 border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block mb-1">
            Attendance Rate
          </span>
          <div className="text-2xl font-extrabold text-primary dark:text-[#3A9DE9] leading-tight">{rate}%</div>
        </Card>

        <Card variant="flat" padding="sm" className="text-center dark:bg-slate-900 border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block mb-1">
            Present Days
          </span>
          <div className="text-2xl font-extrabold text-emerald-500 dark:text-emerald-450 leading-tight">{presentCount}</div>
        </Card>

        <Card variant="flat" padding="sm" className="text-center dark:bg-slate-900 border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block mb-1">
            Late & Half-Days
          </span>
          <div className="text-2xl font-extrabold text-amber-500 dark:text-amber-450 leading-tight">{lateCount + halfDayCount}</div>
        </Card>

        <Card variant="flat" padding="sm" className="text-center dark:bg-slate-900 border-slate-100 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block mb-1">
            Absent Days
          </span>
          <div className="text-2xl font-extrabold text-red-500 dark:text-red-450 leading-tight">{absentCount}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid - 7 Columns */}
        <Card variant="flat" className="lg:col-span-7 flex flex-col justify-between dark:bg-slate-900 border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <h3 className="font-sans text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
                Monthly Work Grid
              </h3>
            </div>

            {/* Days of week titles */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
                <span key={day} className={`text-xs font-bold uppercase tracking-wider py-1 ${idx === 0 ? "text-red-500 dark:text-red-450" : "text-slate-400 dark:text-slate-500"}`}>
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar grid items */}
            <div className="grid grid-cols-7 gap-2">
              {blanks.map((_, index) => (
                <div key={`blank-${index}`} className="aspect-square bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-transparent" />
              ))}

              {daysInMonth.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const dayLog = attendanceData[dateStr] || { date: dateStr, status: "UNLOGGED" };
                const dayNum = format(day, "d");
                const dayOfWeek = getDay(day);
                const isSunday = dayOfWeek === 0;

                let bgClass = "bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300";
                
                if (dayLog.status === "PRESENT") {
                  bgClass = "bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400";
                } else if (dayLog.status === "LATE" || dayLog.status === "HALF_DAY") {
                  bgClass = "bg-amber-50/20 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 text-amber-600 dark:text-amber-400";
                } else if (dayLog.status === "ABSENT") {
                  bgClass = "bg-red-50/20 dark:bg-red-950/10 border-red-100 dark:border-red-900/30 hover:bg-red-50/30 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400";
                } else if (isSunday) {
                  // Highlight Sundays elegantly in red (holiday)
                  bgClass = "bg-red-50/10 dark:bg-red-950/5 border-red-100/40 dark:border-red-900/20 hover:bg-red-50/20 dark:hover:bg-red-950/10 text-red-500 dark:text-red-450";
                }

                return (
                  <div
                    key={dateStr}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative p-1.5 transition-all cursor-pointer ${bgClass}`}
                  >
                    <span className={`text-xs font-extrabold ${
                      isToday(day) ? "bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full shadow-sm" : ""
                    }`}>
                      {dayNum}
                    </span>
                    <div className="mt-1 flex items-center justify-center h-5 w-5">
                      {isSunday && dayLog.status === "UNLOGGED" ? (
                        <span className="text-[7px] font-extrabold text-red-400 dark:text-red-500 uppercase tracking-widest leading-none">
                          Hol
                        </span>
                      ) : (
                        getStatusIcon(dayLog.status)
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Indicator Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 justify-center sm:justify-start">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Late/Half-day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-red-500 dark:text-red-450">Sunday (Holiday)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>Unlogged</span>
            </div>
          </div>
        </Card>

        {/* Detailed Logs List - 5 Columns */}
        <Card variant="flat" className="lg:col-span-5 flex flex-col dark:bg-slate-900 border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4">
            <h3 className="font-sans text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
              Recent Logs Details
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[360px] pr-1 space-y-3 no-scrollbar">
            {Object.values(attendanceData)
              .filter((log) => log.status !== "UNLOGGED")
              .reverse()
              .map((log) => {
                const date = new Date(log.date);

                return (
                  <div
                    key={log.date}
                    className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {format(date, "EEEE, dd MMM")}
                      </h4>
                      {log.status !== "ABSENT" ? (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                          <span>🕒</span> {log.checkIn} - {log.checkOut} ({log.hours}h)
                        </p>
                      ) : (
                        <p className="text-[10px] text-red-500 dark:text-red-400 font-extrabold uppercase tracking-widest mt-1 flex items-center gap-1">
                          <span>⚠️</span> No punch logs recorded
                        </p>
                      )}
                    </div>
                    
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider transition-colors ${
                      log.status === "PRESENT" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30" :
                      log.status === "LATE" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30" :
                      log.status === "HALF_DAY" ? "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/30" : 
                      "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30"
                    }`}>
                      {getStatusLabel(log.status)}
                    </span>
                  </div>
                );
              })}
          </div>
        </Card>
      </div>
    </div>
  );
}
