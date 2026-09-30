import { useEffect } from "react";
import { taskApi } from "./services/taskApi";
import MainMenu from "./pages/MainMenu";

export default function App() {
  useEffect(() => {
    const testTaskApi = async () => {
      try {
        console.log("🔄 Memulai uji coba taskApi...");
        const tasks = await taskApi.getTasks();
        console.log("✅ 1. GET /task berhasil:", tasks);
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
    <>
      <MainMenu />
    </>
  );
}
