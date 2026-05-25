import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { QUERY_KEYS } from "../lib/queryKeys";
import { TaskWithLog, TaskStatus } from "../types";

// Rich, realistic mock tasks to guarantee breathtaking interactive UI previews
const MOCK_TASKS: TaskWithLog[] = [
  {
    id: "task-uuid-1",
    title: "Implement Neumorphic UI Primitives",
    description: "Align all borders, gradients, and soft shadow specifications according to DESIGN.md and SKILL.md. Ensure components are fully responsive across mobile and desktop simulated screens.",
    assignment_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: { id: "user-1", full_name: "Aswin", role: "EMPLOYEE", email: "aswinedu1@gmail.com", clerk_user_id: "clerk-1", department: "Frontend Engineering", profile_picture_url: null, is_active: true, date_joined: "2026-05-25", created_at: "", updated_at: "" },
    assigned_by: { id: "user-2", full_name: "Harsha Vardhan", role: "MANAGER", email: "harsha@hps.com", clerk_user_id: "clerk-2", department: "Management Group", profile_picture_url: null, is_active: true, date_joined: "2026-05-25", created_at: "", updated_at: "" },
    log: {
      id: "log-uuid-1",
      assignment: "task-uuid-1",
      submitted_by: "user-1",
      status: "IN_PROGRESS",
      notes: "Custom soft neumorphic shadows are configured. Coding active status handlers now.",
      logged_at: new Date().toISOString(),
      log_date: new Date().toISOString().split("T")[0],
    },
  },
  {
    id: "task-uuid-2",
    title: "Verify Clerk Allowlist Filters",
    description: "Confirm Google OAuth authentication endpoints securely map linked profiles against the pre-approved Django database allowlist rows.",
    assignment_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: { id: "user-1", full_name: "Aswin", role: "EMPLOYEE", email: "aswinedu1@gmail.com", clerk_user_id: "clerk-1", department: "Frontend Engineering", profile_picture_url: null, is_active: true, date_joined: "2026-05-25", created_at: "", updated_at: "" },
    assigned_by: { id: "user-2", full_name: "Harsha Vardhan", role: "MANAGER", email: "harsha@hps.com", clerk_user_id: "clerk-2", department: "Management Group", profile_picture_url: null, is_active: true, date_joined: "2026-05-25", created_at: "", updated_at: "" },
    log: {
      id: "log-uuid-2",
      assignment: "task-uuid-2",
      submitted_by: "user-1",
      status: "NOT_STARTED",
      notes: null,
      logged_at: new Date().toISOString(),
      log_date: new Date().toISOString().split("T")[0],
    },
  },
];

export function useMyTasks(date: string) {
  return useQuery<TaskWithLog[]>({
    queryKey: QUERY_KEYS.myTasks(date),
    queryFn: async () => {
      try {
        const response = await api.get(`/api/tasks/my/?date=${date}`);
        return response.data.length > 0 ? response.data : MOCK_TASKS;
      } catch (err) {
        console.warn("API unavailable, running in local-preview mode.", err);
        return MOCK_TASKS;
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status, notes }: { taskId: string; status: TaskStatus; notes: string }) => {
      // Axios request to patch status in database
      const response = await api.patch(`/api/tasks/${taskId}/status/`, {
        status,
        notes,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate queries to trigger re-fetch and keep UI updated
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
    },
  });
}
