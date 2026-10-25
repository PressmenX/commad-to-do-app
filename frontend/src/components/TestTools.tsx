import { useState } from "react";
import { Wrench } from "lucide-react";
import { ConsoleDisplay } from "./ConsoleDisplay";
import { useAuth } from "../context/AuthContext";
import { generateSeedTask } from "../services/seed-data";
import { taskApi } from "../services/taskApi";
import type { ICreateTask } from "..";
import ButtonWithId from "./ButtonWithId";

export default function TestTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConsoleOpen, setConsoleIsOpen] = useState(false);
 const { login, logout } = useAuth(); 

  const handleLogin = async () => {
    try {
      await login("siti.nur@domain.co.id", "Password123!");
      console.log("Login success");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout success");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddTask = async () => {
    try {
      const newTask: ICreateTask = generateSeedTask();
      const result = await taskApi.addTask(newTask);
      console.log("POST /task success:", result);
    } catch (error) {
      console.error("POST /task failed:", error);
    }
  };

  const handleGetTask = async () => {
    try {
      const result = await taskApi.getTasks();
      console.log("GET /task success:", result);
    } catch (error) {
      console.error("GET /task failed:", error);
    }
  };

  const handleUpdateTask = async (id: string) => {
    try {
      const task: ICreateTask = generateSeedTask();
      const result = await taskApi.updateTask(id, task);
      console.log("PATCH /task success:", result);
    } catch (error) {
      console.error("PATCH /task failed:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const result = await taskApi.deleteTask(id);
      console.log("DELETE /task success:", result);
    } catch (error) {
      console.error("DELETE /task failed:", error);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-2 py-2 text-white font-semibold transition-all duration-500 ${isOpen ? "border border-white bg-surface rounded-xl" : "btn-glass"}`}
        >
          <Wrench
            className={`w-5 h-5 ${isOpen ? "text-blue-500" : ""}`}
            strokeWidth={1.5}
            fill="currentColor"
          />
        </button>

        {isOpen && (
          <div className="w-56 min-h-64 p-4 bg-glass">
            <h3 className="font-bold text-sm mb-2 text-center text-surface">
              Testing Tools
            </h3>
            <div className="form-control ">
              <label className="label cursor-pointer w-full flex justify-around">
                <span className="label-text text-surface">Console output</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm"
                  checked={isConsoleOpen}
                  onChange={() => setConsoleIsOpen(!isConsoleOpen)}
                />
              </label>
            </div>
            <div className="[&>button]:btn [&>button]:text-primary [&>button]:btn-block [&>button]:btn-sm py-2 flex flex-col gap-2">
              <button onClick={handleLogin}>Login</button>
              <button onClick={handleLogout}>Logout</button>
              <button onClick={handleGetTask}>Get Task</button>
              <button onClick={handleAddTask}>Add Task</button>
              <ButtonWithId label="Update Task" onAction={handleUpdateTask} />
              <ButtonWithId label="Remove Task" onAction={handleDeleteTask} />
            </div>
          </div>
        )}
      </div>

      {isConsoleOpen && <ConsoleDisplay />}
    </>
  );
}
