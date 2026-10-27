import { Home, Plus, Settings } from "lucide-react";
import { Link } from "react-router";
import NiceModal from "@ebay/nice-modal-react";
import AddTaskModal from "./task/modal/AddTaskModal";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_30px_rgba(0,0,0,0.15)] z-50">
      <div className="flex justify-between items-center h-16 relative px-12">
        <Link
          to="/main"
          className="flex flex-col items-center gap-1 text-base-content/60 hover:text-primary transition-colors"
        >
          <Home size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <div className="absolute left-1/2 -top-4 -translate-x-1/2 ">
          <button
            onClick={() => NiceModal.show(AddTaskModal)}
            className="btn bg-brand-gradient btn-circle border-none h-14 w-14 text-white shadow-[0_0_10px_2px_rgba(0,0,0,0.3)] shadow-primary hover:scale-105 transition-transform"
            aria-label="Add Task"
          >
            <Plus size={26} />
          </button>
        </div>
        <Link
          to="/setting"
          className="flex flex-col items-center gap-1 text-base-content/60 hover:text-primary transition-colors"
        >
          <Settings size={22} />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
}
