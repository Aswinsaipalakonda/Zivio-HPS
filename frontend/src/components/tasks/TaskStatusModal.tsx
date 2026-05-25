"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, RefreshCw, PauseCircle, HelpCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { TaskWithLog, TaskStatus } from "../../types";

export interface TaskStatusModalProps {
  task: TaskWithLog | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, status: TaskStatus, notes: string) => Promise<void>;
}

export const TaskStatusModal: React.FC<TaskStatusModalProps> = ({ task, isOpen, onClose, onSubmit }) => {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>("NOT_STARTED");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial task status when loaded
  useEffect(() => {
    if (task) {
      setSelectedStatus(task.log?.status || "NOT_STARTED");
      setNotes(task.log?.notes || "");
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const isNotesRequired = selectedStatus !== "COMPLETED";
  const isSubmitDisabled = isNotesRequired && !notes.trim();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(task.id, selectedStatus, notes);
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions: { value: TaskStatus; label: string; icon: any; colorClass: string; activeClass: string }[] = [
    {
      value: "COMPLETED",
      label: "Completed",
      icon: CheckCircle2,
      colorClass: "text-[#10B981] border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50",
      activeClass: "bg-[#10B981] text-white border-[#10B981]",
    },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
      icon: RefreshCw,
      colorClass: "text-primary border-blue-100 bg-blue-50/40 hover:bg-blue-50",
      activeClass: "bg-primary text-white border-primary",
    },
    {
      value: "PENDING",
      label: "Pending",
      icon: PauseCircle,
      colorClass: "text-[#F59E0B] border-amber-100 bg-amber-50/40 hover:bg-amber-50",
      activeClass: "bg-[#F59E0B] text-white border-[#F59E0B]",
    },
    {
      value: "NOT_STARTED",
      label: "Not Started",
      icon: HelpCircle,
      colorClass: "text-slate-500 border-slate-200 bg-slate-50 hover:bg-slate-100",
      activeClass: "bg-slate-700 text-white border-slate-700",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full sm:max-w-md bg-white border border-slate-100 shadow-xl rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        
        {/* Mobile top drag handle */}
        <div className="flex sm:hidden justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
          <div className="min-w-0 pr-4">
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-primary block">
              Status Management
            </span>
            <h3 className="text-base font-bold text-slate-800 truncate font-sans">
              {task.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 shrink-0 transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* Status grid */}
          <div>
            <label className="font-sans text-xs font-bold text-slate-500 block mb-2 uppercase tracking-wide">
              Select Current Status
            </label>
            
            {/* Grid of visual options */}
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((opt) => {
                const isSelected = selectedStatus === opt.value;
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedStatus(opt.value)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl border font-sans text-xs font-semibold uppercase tracking-wider transition-all text-left active:scale-[0.98] ${
                      isSelected
                        ? `${opt.activeClass}`
                        : `${opt.colorClass}`
                    }`}
                    style={{ minHeight: "48px" }}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remarks/Notes */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-sans text-xs font-bold uppercase tracking-wide">
              <label className="text-slate-500">
                Log Notes {isNotesRequired && <span className="text-red-500">*</span>}
              </label>
              {isNotesRequired && (
                <span className="text-red-500 font-bold uppercase tracking-widest text-[8px] animate-pulse">
                  Block Notes Required
                </span>
              )}
            </div>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isNotesRequired
                  ? "Explain current blocker points, pending milestones, or roadmap status..."
                  : "Add any task completion notes or remarks (optional)..."
              }
              rows={4}
              className="bg-white border border-slate-200 font-sans text-sm rounded-xl w-full p-3.5 text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitDisabled}
            >
              Update Log Status
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
