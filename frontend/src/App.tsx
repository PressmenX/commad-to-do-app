import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import StartMenu from "./pages/StartMenu";
import MainMenu from "./pages/MainMenu";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TestTools from "./components/TestTools";
import NiceModal from "@ebay/nice-modal-react";
import SettingMenu from "./pages/SettingMenu";
import NetworkStatusBanner from "./components/NetworkStatusBanner";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoading, isLoggedIn, sessionStatus, retrySessionCheck } = useAuth();
  const isOnline = useOnlineStatus();

  if (isLoading) {
    return (
      <div
        className="flex min-h-dvh items-center justify-center"
        role="status"
        aria-label="Checking session"
      >
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (sessionStatus === "unknown") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-bold">Tidak dapat memastikan sesi</h1>
        <p className="max-w-sm text-base-content/70">
          {isOnline
            ? "Status login belum dapat diperiksa. Coba periksa kembali."
            : "Sedang offline. Sesi login belum dapat diverifikasi. Hubungkan kembali ke internet untuk melanjutkan."}
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={retrySessionCheck}
          disabled={!isOnline}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NiceModal.Provider>
          <NetworkStatusBanner />
          {import.meta.env.MODE === "development" && <TestTools />}
          <Routes>
            <Route path="/" element={<StartMenu />} />
            <Route
              path="/main"
              element={
                <RequireAuth>
                  <MainMenu />
                </RequireAuth>
              }
            />
            <Route path="/setting" element={<SettingMenu />} />
          </Routes>
        </NiceModal.Provider>
      </BrowserRouter>
    </AuthProvider>
  );
}
