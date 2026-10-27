import { Link } from "react-router";
import TaskList from "../components/task/TaskList";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import UserProgressCard from "../components/UserProgressCard";
import BottomNav from "../components/BottomNav";
import { useState } from "react";

export default function MainMenu() {
  const { isLoggedIn } = useAuth();
  const [isBulkMode, setIsBulkMode] = useState(false);

  return (
    <div className="safe-area-screen min-h-dvh pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <UserProgressCard />
      <Link to="/">
        <button className="btn btn-primary btn-sm btn-circle fixed top-[calc(env(safe-area-inset-top)+1rem)] left-4 z-999 opacity-30 transition hover:opacity-100 active:scale-95 active:opacity-100">
          <ArrowLeft />
        </button>
      </Link>
      <TaskList onBulkModeChange={setIsBulkMode} />
      {isLoggedIn && !isBulkMode && <BottomNav />}
    </div>
  );
}
