import { useEffect } from "react";
import { taskApi } from "./services/taskApi";

export default function App() {
  useEffect(() => {
    const testTaskApi = async () => {
      try {
        console.log("🔄 Memulai uji coba taskApi...");
        const tasks = await taskApi.getTasks();
        console.log("✅ 1. GET /task berhasil:", tasks);

        const newTask = await taskApi.addTask({
          name: "Task Uji Coba Unit 19",
          details: "Dibuat dari pengujian taskApi.ts",
          priority: "HIGH",
          category: "Testing",
        });
        console.log("✅ 2. POST /task berhasil:", newTask);
      } catch (error: unknown) {
        console.error("❌ Gagal menjalankan test taskApi:", (error as Error).message ?? error);
      }
    };

    void testTaskApi();
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl font-bold text-primary">
        Welcome to Command Todo App
      </h1>
      <button className="btn btn-lg btn-primary active:scale-95 transition-transform">
        Start
      </button>
    </div>
  );
}
