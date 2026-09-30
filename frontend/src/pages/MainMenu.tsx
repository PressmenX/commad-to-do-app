import { ArrowRight, Terminal } from "lucide-react";
import { authApi } from "../services/authApi";
import TestTools from "../components/TestTools";

export default function MainMenu() {
  const handleLogin = async () => {
    try {
      const result = await authApi.login(
        "siti.nur@domain.co.id",
        "Password123!",
      );
      console.log("Login sukses:", result);
    } catch (error) {
      console.error("Login gagal:", error);
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col px-6 py-6 font-sans sm:py-8">
      <TestTools>
        <button onClick={handleLogin}>Login</button>
      </TestTools>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-8 shadow-sm">
          <Terminal className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-200 mb-5 tracking-tight">
          Command Todo
        </h1>

        <p className="text-lg text-slate-600 text-center leading-relaxed px-4 mb-5">
          Keyboard-first task management for focused minds.
        </p>

        <p className="text-base text-slate-500 text-center leading-relaxed px-2">
          Capture, structure, and dispatch tasks instantly with natural
          keystrokes and slash commands.
        </p>
      </div>

      <div className="w-full  flex flex-col items-center gap-6 pb-2 px-6">
        <button className="btn btn-block btn-primary text-white rounded-xl border-none text-[17px] h-14 min-h-14 font-normal normal-case shadow-md active:brightness-150 active:scale-95 transition-all hover:brightness-120">
          Get Started
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>

        <p className="text-base text-slate-600">
          Already have an account?{" "}
          <span
            className="cursor-pointer text-primary underline hover:brightness-150"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
