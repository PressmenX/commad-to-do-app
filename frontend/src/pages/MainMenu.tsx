import { Link } from "react-router";
import TaskList from "../components/task/TaskList";
import { ArrowLeft, Plus } from "lucide-react";
import AddTaskModal from "../components/task/AddTaskModal";
import NiceModal from "@ebay/nice-modal-react";
import { useAuth } from "../context/AuthContext";

export default function MainMenu() {
  const { isLoggedIn } = useAuth();

  return (
    <div className=" min-h-dvh">
      <Link to="/">
        <button className="btn btn-primary btn-sm btn-circle fixed top-4 left-4 z-999 opacity-30 transition hover:opacity-100 active:scale-95 active:opacity-100">
          <ArrowLeft />
        </button>
      </Link>
      <TaskList />
     {isLoggedIn && <button
        onClick={() => NiceModal.show(AddTaskModal)}
        className="btn btn-primary btn-circle btn-lg fixed bottom-4 right-4 shadow-xl z-50 text-white"
        aria-label="Add Task"
      >
        <Plus size={24} />
      </button>}
    </div>
  );
}
