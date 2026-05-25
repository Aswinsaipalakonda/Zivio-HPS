import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { QUERY_KEYS } from "../lib/queryKeys";
import { TaskWithLog, TaskStatus } from "../types";


export function useMyTasks(date: string) {
  return useQuery<TaskWithLog[]>({
    queryKey: QUERY_KEYS.myTasks(date),
    queryFn: async () => {
      const response = await api.get(`/api/tasks/my/?date=${date}`);
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    initialData: [],
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
