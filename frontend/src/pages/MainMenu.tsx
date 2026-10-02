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
    <div className="flex min-h-dvh w-full flex-col px-6 py-6 font-sans sm:py-8 bg-linear-to-b from-[#EE5431] via-[#D73E1B] to-[#9E250A]">
      <TestTools>
        <button onClick={handleLogin} className="">
          Login
        </button>
        <button>Add Task</button>
        <button>Update Task</button>
        <button>Get Task</button>
        <button>Remove Task</button>
      </TestTools>

      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-3xl  text-surface font-bold mb-5 tracking-tight">
          Command Todo
        </h1>
        <div className="relative flex items-center justify-center p-8">
          {/* 1. Light Glow Putih-Kuning di Luar */}
          <div className="absolute w-32 h-32 rounded-3xl bg-white/80 blur-lg pointer-events-none" />

          <div className="relative w-24 h-24 rounded-xl bg-linear-to-b from-[#F36B63] via-[#E85248] to-[#CD382E] shadow-[0_12px_24px_-4px_rgba(180,30,20,0.5),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.25)] flex items-center justify-center border border-white/50">
            <div className="absolute inset-0 rounded-xl bg-linear-to-b from-white/25 via-transparent to-black/20 pointer-events-none" />

            <Terminal className="relative z-10 w-12 h-12 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)]" />
          </div>
        </div>

        <p className="text-xl text-surface font-bold text-center leading-relaxed px-4 mb-5">
          Keyboard-first task management for focused minds.
        </p>

        <p className="text-surface/70 text-center px-8">
          Capture, structure, and dispatch tasks instantly with natural
          keystrokes and slash commands.
        </p>
      </div>

      <div className="w-72  flex flex-col items-center gap-6 pb-2 mx-auto">
        <button className="btn btn-block bg-surface text-primary rounded-full text-lg font-semibold h-12 min-h-12 flex items-center justify-center group transition-all duration-300 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.98] border-0">
          Get Started
          <ArrowRight className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-4" />
        </button>
        <button className="btn btn-block btn-outline rounded-full  h-12 min-h-12 text-white font-semibold text-lg border-white hover:bg-white hover:text-primary hover:border-white transition-all duration-300 active:scale-[0.98]">
          Log in
        </button>
      </div>
    </div>
  );
}
