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

  // Determine if notes are required (required for IN_PROGRESS, PENDING, NOT_STARTED)
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
      colorClass: "text-[#00A63D] border-[#00A63D]/40 bg-[#00A63D]/5",
      activeClass: "bg-[#00A63D] text-white border-[#00A63D]",
    },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
      icon: RefreshCw,
      colorClass: "text-primary border-primary/40 bg-primary/5",
      activeClass: "bg-primary text-white border-primary",
    },
    {
      value: "PENDING",
      label: "Pending",
      icon: PauseCircle,
      colorClass: "text-[#FE9900] border-[#FE9900]/40 bg-[#FE9900]/5",
      activeClass: "bg-[#FE9900] text-white border-[#FE9900]",
    },
    {
      value: "NOT_STARTED",
      label: "Not Started",
      icon: HelpCircle,
      colorClass: "text-text/60 border-text/25 bg-text/5",
      activeClass: "bg-text/75 text-white border-text/75",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop backdrop blur */}
      <div className="absolute inset-0 bg-[#0f1117]/40 backdrop-blur-[2px] transition-all" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full sm:max-w-md bg-surface border border-white/60 shadow-neu-flat rounded-t-neu sm:rounded-neu p-6 max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        
        {/* Mobile top drag handle bar representation */}
        <div className="flex sm:hidden justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-text/25" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5 border-b border-text/5 pb-3">
          <div className="min-w-0 pr-4">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary block">
              Status Management
            </span>
            <h3 className="text-base font-extrabold text-text truncate font-sans">
              {task.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface border border-white/40 shadow-neu-sm flex items-center justify-center text-text/60 hover:text-text shrink-0 active:shadow-neu-sm-pressed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* Status grid title */}
          <div>
            <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-text/60 block mb-2">
              Select Current Status
            </label>
            
            {/* 2x2 Grid of visual neumorphic option buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              {statusOptions.map((opt) => {
                const isSelected = selectedStatus === opt.value;
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedStatus(opt.value)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-lg border font-mono text-xs font-bold uppercase tracking-wide transition-all shadow-neu-sm text-left ${
                      isSelected
                        ? `${opt.activeClass} shadow-neu-sm-pressed translate-y-[1px]`
                        : `${opt.colorClass} hover:translate-y-[-1px]`
                    }`}
                    style={{ minHeight: "48px" }}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "animate-spin-slow text-white" : ""}`} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remarks text logs field */}
          <div>
            <div className="flex justify-between items-center mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wider">
              <label className="text-text/60">
                Log Notes {isNotesRequired && <span className="text-danger">*</span>}
              </label>
              {isNotesRequired && (
                <span className="text-danger/80 font-bold uppercase tracking-widest text-[8px] animate-pulse">
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
              className="neu-input bg-surface shadow-neu-sm-pressed font-sans text-xs border-0 rounded-lg w-full p-3 text-text focus:outline-none resize-none"
            />
          </div>

          {/* Submit details panel */}
          <div className="pt-2">
            <Button
              type="submit"
              variant={selectedStatus === "COMPLETED" ? "primary" : "secondary"}
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
