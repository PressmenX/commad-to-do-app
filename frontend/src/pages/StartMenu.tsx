import { ArrowRight } from "lucide-react";
import NiceModal from "@ebay/nice-modal-react";
import AuthModal from "../components/auth/AuthModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import "./../../app-version.d.ts";
export default function StartMenu() {
  const { isLoggedIn, isLoading, sessionStatus, retrySessionCheck } = useAuth();
  const isCheckingSession = sessionStatus === "unknown" && isLoading;
  const isSessionUnknown = sessionStatus === "unknown" && !isLoading;
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 overflow-y-auto overscroll-y-none bg-brand-gradient font-sans">
      <div className="flex min-h-full w-full flex-col px-6 py-6 sm:py-8">
        <div className="flex flex-1 flex-col items-center justify-center">
          <h1 className="text-3xl text-surface font-bold mb-4">Command Todo</h1>
          <div className="flex items-center justify-center p-5 my-4 sm:p-6 sm:my-8 bg-white rounded-full">
            <img
              src="/pwa-512x512.png"
              alt=""
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl"
            />
          </div>

          <p className="text-xl text-surface font-bold text-center leading-relaxed px-4 mb-4">
            Keyboard-first task management for focused minds.
          </p>

          <p className="text-surface/70 text-center px-8">
            Capture, structure, and dispatch tasks instantly with natural
            keystrokes and slash commands.
          </p>
        </div>

        <div className="w-72 min-h-32 flex flex-col items-center gap-6 pb-2 mx-auto mb-8">
          {isCheckingSession ? (
            <div
              role="status"
              aria-label="Memeriksa sesi login"
              className="h-12 w-full animate-pulse rounded-full bg-white/30"
            />
          ) : isSessionUnknown ? (
            <>
              <p className="text-surface/80 text-center text-sm">
                Login status cannot be checked yet.
              </p>
              <button
                onClick={retrySessionCheck}
                className="btn btn-block btn-outline rounded-full h-12 min-h-12 text-white font-semibold text-lg border-white hover:bg-white hover:text-primary hover:border-white"
              >
                Try again
              </button>
            </>
          ) : isLoggedIn ? (
            <button
              onClick={() => navigate("/main")}
              className="btn btn-block bg-surface text-primary rounded-full text-lg font-semibold mt-4 h-12 min-h-12 flex items-center justify-center group transition-all duration-300 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.98] border-0 hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.4)]"
            >
              Start Your Task
              <ArrowRight className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() =>
                  NiceModal.show(AuthModal, { initialMode: "register" })
                }
                className="btn btn-block bg-surface text-primary rounded-full text-lg font-semibold h-12 min-h-12 flex items-center justify-center group transition-all duration-300 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.98] border-0 hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.4)]"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-4" />
              </button>

              <button
                onClick={() =>
                  NiceModal.show(AuthModal, { initialMode: "login" })
                }
                className="btn btn-block btn-outline rounded-full h-12 min-h-12 text-white font-semibold text-lg border-white hover:bg-white hover:text-primary hover:border-white transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.4)]"
              >
                Log in
              </button>
            </>
          )}
        </div>

        <p className="bottom-1 left-1 absolute text-center text-xs text-surface/70 bg-black/20 py-1 px-2 rounded-xl">
          version {__APP_VERSION__}
        </p>
      </div>
    </div>
  );
}
