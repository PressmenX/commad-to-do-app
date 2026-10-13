import { Link } from "react-router";
import TaskList from "../components/TaskList";
import { ArrowLeft } from "lucide-react";

export default function MainMenu() {
  return (
    <div className=" min-h-dvh">
      <Link to="/">
                <button className="btn btn-primary btn-sm btn-circle fixed top-4 left-4 z-999 opacity-30 transition hover:opacity-100 active:scale-95 active:opacity-100">
                  <ArrowLeft/>
                </button>
              </Link>
      <TaskList/>
    </div>
  );
}
