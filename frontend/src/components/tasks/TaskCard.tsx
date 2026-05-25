import React, { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Edit3, Lock } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { TaskWithLog } from "../../types";
import { getStatusColor, formatDate } from "../../lib/utils";

export interface TaskCardProps {
  task: TaskWithLog;
  onUpdateStatus?: (task: TaskWithLog) => void;
  isReadOnly?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateStatus, isReadOnly = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const status = task.log?.status || "NOT_STARTED";
  const statusColor = getStatusColor(status);
  const notes = task.log?.notes;

  return (
    <Card
      className="transition-all hover:-translate-y-[1px] duration-150 select-none w-full border-l-4"
      style={{ borderLeftColor: statusColor }}
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <h3 className="font-sans text-base font-bold text-slate-800 truncate">
          {task.title}
        </h3>
        <div className="shrink-0 flex items-center">
          <Badge status={status} />
        </div>
      </div>

      {/* Description section */}
      <div className="mb-4">
        <p
          className={`text-sm text-slate-500 font-sans leading-relaxed transition-all duration-200 ${
            isExpanded ? "line-clamp-none" : "line-clamp-2"
          }`}
        >
          {task.description}
        </p>

        {/* Toggle description display button */}
        {task.description.length > 120 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 mt-1 text-xs font-semibold text-primary hover:text-[#2480CC] focus:outline-none"
          >
            {isExpanded ? (
              <>
                <span>Collapse Details</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Expand Details</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Submitted notes if active */}
      {notes && (
        <div className="mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Status Logs Notes
          </span>
          <p className="text-xs text-slate-600 font-sans italic leading-relaxed">
            "{notes}"
          </p>
        </div>
      )}

      {/* Footer row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-2 text-slate-400 font-sans text-xs">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>
            Last active: {task.log ? formatDate(task.log.logged_at, "hh:mm a, dd MMM") : "Never"}
          </span>
        </div>

        {/* Status update action control */}
        {isReadOnly ? (
          <div className="flex items-center gap-1.5 text-slate-400 font-sans text-[10px] font-bold uppercase tracking-widest leading-none bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 shrink-0 select-none">
            <Lock className="w-3 h-3" />
            <span>Read-Only</span>
          </div>
        ) : (
          onUpdateStatus && (
            <Button
              variant="outline"
              className="w-full sm:w-auto h-9 text-xs py-0 shrink-0 border-slate-200"
              style={{ minHeight: "36px" }}
              onClick={() => onUpdateStatus(task)}
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5 text-primary" />
              <span>Update Status</span>
            </Button>
          )
        )}
      </div>
    </Card>
  );
};
