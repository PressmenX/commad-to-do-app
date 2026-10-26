import { useQueryClient } from "@tanstack/react-query";
import NiceModal from "@ebay/nice-modal-react";
import { useState } from "react";
import type { ITask } from "../index";
import { notifyOfflineTaskAction, taskApi } from "../services/taskApi";
import ConfirmDeleteModal from "../components/task/modal/ConfirmDeleteModal";

export function useBulkTaskActions(tasks: ITask[], visibleTasks: ITask[]) {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const taskIds = new Set(tasks.map((task) => task.id));
  const selectedTaskIds = selectedIds.filter((id) => taskIds.has(id));
  const selectedIdSet = new Set(selectedTaskIds);

  const toggleSelection = (id: string) => {
    if (!taskIds.has(id)) return;

    setSelectedIds((currentIds) => {
      const activeIds = currentIds.filter((selectedId) =>
        taskIds.has(selectedId),
      );
      return activeIds.includes(id)
        ? activeIds.filter((selectedId) => selectedId !== id)
        : [...activeIds, id];
    });
  };

  const visibleIds = visibleTasks.map((task) => task.id);
  const isAllVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIdSet.has(id));

  const toggleVisibleSelection = () => {
    setSelectedIds((currentIds) => {
      const currentSelectedIds = currentIds.filter((id) => taskIds.has(id));
      const currentSelectedSet = new Set(currentSelectedIds);
      const allVisibleSelected = visibleIds.every((id) =>
        currentSelectedSet.has(id),
      );

      return allVisibleSelected
        ? currentSelectedIds.filter((id) => !visibleIds.includes(id))
        : [...new Set([...currentSelectedIds, ...visibleIds])];
    });
  };

  const toggleBulkMode = () => {
    if (isProcessing) return;

    setIsBulkMode((isActive) => !isActive);
    setSelectedIds([]);
  };

  const clearSelection = () => setSelectedIds([]);

  const runBulkAction = async (
    action: (task: ITask) => Promise<unknown>,
    failureMessage: string,
  ) => {
    if (!navigator.onLine) {
      notifyOfflineTaskAction();
      return;
    }

    const selectedTasks = tasks.filter((task) => selectedIdSet.has(task.id));
    setIsProcessing(true);

    try {
      const results = await Promise.allSettled(selectedTasks.map(action));
      const failedTasks = selectedTasks.filter(
        (_, index) => results[index].status === "rejected",
      );

      if (navigator.onLine) {
        await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
      setSelectedIds((currentIds) => [
        ...currentIds.filter(
          (id) => taskIds.has(id) && !selectedIdSet.has(id),
        ),
        ...failedTasks.map((task) => task.id),
      ]);

      if (failedTasks.length > 0) {
        alert(
          `${failedTasks.length} ${failureMessage} Failed tasks remain selected.`,
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const markDone = () =>
    runBulkAction(
      (task) => taskApi.updateTask(task.id, { isCompleted: true }),
      "task failed to update.",
    );

  const deleteSelected = () => {
    const selectedTasks = tasks.filter((task) => selectedIdSet.has(task.id));
    if (selectedTasks.length === 0) return;

    void NiceModal.show(ConfirmDeleteModal, {
      tasksToDelete: selectedTasks,
      onConfirm: () =>
        runBulkAction(
          (task) => taskApi.deleteTask(task.id),
          "task failed to delete.",
        ),
    });
  };

  return {
    isBulkMode,
    isProcessing,
    selectedIds: selectedTaskIds,
    isAllVisibleSelected,
    toggleSelection,
    toggleVisibleSelection,
    toggleBulkMode,
    clearSelection,
    markDone,
    deleteSelected,
  };
}
