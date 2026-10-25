import { Settings, Flag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGetTask } from "../hooks/useGetTask";
import { Link } from "react-router";

export default function UserProgressCard() {
  const { user } = useAuth();
  const { data: tasks = [] } = useGetTask();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highCount = tasks.filter(
    (t) => !t.isCompleted && t.priority === "HIGH",
  ).length;
  const mediumCount = tasks.filter(
    (t) => !t.isCompleted && t.priority === "MEDIUM",
  ).length;
  const lowCount = tasks.filter(
    (t) => !t.isCompleted && t.priority === "LOW",
  ).length;

  return (
    <div className="relative overflow-hidden bg-brand-gradient min-h-40 rounded-3xl m-4 p-5 shadow-2xl shadow-black/30 border-t border-l border-white/40 border-r-white/15 border-b-white/15 text-white flex flex-col justify-between">
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full border-4 border-white/25 pointer-events-none" />
      <div className="absolute right-4 -bottom-14 w-32 h-32 rounded-full border-2 border-white/20 pointer-events-none" />
      <div className="absolute right-12 -bottom-6 w-20 h-20 rounded-full border-2 border-white/15 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold border border-white/30 backdrop-blur-xs">
              <span>
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-white/80 font-medium">Halo,</p>
            <h1 className="text-base font-bold leading-tight">
              {user?.name || "Pengguna"}
            </h1>
          </div>
        </div>
        <Link
          to="/setting" 
          className="btn btn-ghost btn-circle btn-sm text-white hover:bg-white/20 flex items-center justify-center"
          aria-label="Pengaturan"
        >
          <Settings size={20} />
        </Link>
      </div>

      <div className="relative z-10 flex items-center gap-2 mb-4 p-4 bg-glass">
        <div className="flex-1 flex items-center justify-center gap-1.5 bg-error text-white py-1.5 px-2 rounded-xl shadow-md font-bold text-xs">
          <Flag size={13} fill="currentColor" />
          <span>{highCount} High</span>
        </div>

        <div className="flex-1 flex items-center justify-center gap-1.5 bg-warning/90 text-black py-1.5 px-2 rounded-xl text-xs font-semibold">
          <Flag size={13} fill="currentColor" />
          <span>{mediumCount} Med</span>
        </div>

        <div className="flex-1 flex items-center justify-center gap-1.5 bg-success/90 text-white py-1.5 px-2 rounded-xl text-xs font-semibold">
          <Flag size={13} fill="currentColor" />
          <span>{lowCount} Low</span>
        </div>
      </div>

      <div className="relative z-10 space-y-1.5  p-4 bg-glass">
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-white/90">Task Progress</span>
          <span className="font-mono text-xs text-white/90 font-semibold">
            {completedTasks}/{totalTasks} task
          </span>
        </div>

        <div className="relative w-full bg-white/25 rounded-full h-4 overflow-hidden border border-white/10">
          <div
            className="bg-success h-full transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
