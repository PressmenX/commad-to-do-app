import { useEffect } from "react";
import { taskApi } from "./services/taskApi";
import { ArrowRight, ListChecks, ListChecksIcon } from "lucide-react";

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
        console.error(
          "❌ Gagal menjalankan test taskApi:",
          (error as Error).message ?? error,
        );
      }
    };

    void testTaskApi();
  }, []);
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-base-100 text-base-content">
      <div className="max-w-2xl w-full flex flex-col items-center text-center gap-6">
        
        <div className="p-4 rounded-2xl bg-primary/10 text-primary">
          <ListChecks className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
            Welcome to Command Todo App
          </h1>
          <p className="text-base font-semibold tracking-wide uppercase text-primary/80">
            Your tasks. Your commands. Your way.
          </p>
        </div>

        <p className="text-base-content/70 text-base md:text-lg leading-relaxed max-w-xl">
          A personal to-do list built for speed — manage tasks with simple
          commands or tap-based actions, all stored locally on your device.
        </p>

        <button className="btn btn-primary btn-lg px-8 mt-2 active:scale-95 transition-transform">
          Get Started
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
        
      </div>
    </main>
  );
}
