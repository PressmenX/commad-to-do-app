import { ArrowLeft, LogOut, Moon, Sun, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useGetTask } from "../hooks/useGetTask";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useLocalStorage } from "../hooks/useLocalStorage";
import NiceModal from "@ebay/nice-modal-react";
import ConfirmDeleteModal from "../components/task/modal/ConfirmDeleteModal";
import BottomNav from "../components/BottomNav";
import { applyTheme } from "../utils/theme";

export default function SettingMenu() {
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useAuth();
  const { data: tasks = [] } = useGetTask();
  const { deleteTaskAsync } = useDeleteTask();
  
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const completedTasks = tasks.filter((t) => t.isCompleted);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleClearCompleted = () => {
    if (completedTasks.length === 0) return;

    void NiceModal.show(ConfirmDeleteModal, {
      tasksToDelete: completedTasks,
      onConfirm: async () => {
        await Promise.all(completedTasks.map((task) => deleteTaskAsync(task.id)));
      },
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-dvh bg-base-200 pb-24">
      <Link to="/">
        <button className="btn btn-primary btn-sm btn-circle fixed top-4 left-4 z-999 opacity-30 transition hover:opacity-100 active:scale-95 active:opacity-100">
          <ArrowLeft />
        </button>
      </Link>

      <div className="p-4 sm:p-6 pt-16">
        <h1 className="text-2xl font-bold text-base-content mb-8 text-center">Settings</h1>

        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between p-4 bg-base-200 border border-base-300 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-base-200 rounded-xl">
                {theme === "light" ? <Sun size={24} className="text-warning" /> : <Moon size={24} className="text-primary" />}
              </div>
              <div>
                <p className="font-bold text-base">Theme Appearance</p>
                <p className="text-sm text-base-content/60">Toggle dark or light mode</p>
              </div>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-lg"
              checked={theme === "dark"}
              onChange={handleToggleTheme}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-200 border border-base-300 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-base-200 rounded-xl">
                <Trash2 size={24} className="text-base-content/70" />
              </div>
              <div>
                <p className="font-bold text-base">Clear Completed Tasks</p>
                <p className="text-sm text-base-content/60">
                  {completedTasks.length} task(s) currently completed
                </p>
              </div>
            </div>
            <button
              onClick={handleClearCompleted}
              disabled={completedTasks.length === 0}
              className="btn btn-outline border-base-content/20 hover:bg-error hover:text-white hover:border-error"
            >
              Clear
            </button>
          </div>

          <div className="divider my-6"></div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="btn btn-error btn-outline w-full text-error rounded-2xl h-14 text-lg gap-2 shadow-sm"
          >
            {isLoggingOut ? (
              <span className="loading loading-spinner" />
            ) : (
              <LogOut size={22} />
            )}
            Log out
          </button>
        </div>
      </div>

      {isLoggedIn && <BottomNav />}
    </div>
  );
}