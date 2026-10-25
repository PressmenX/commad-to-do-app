import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import StartMenu from "./pages/StartMenu";
import MainMenu from "./pages/MainMenu";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TestTools from "./components/TestTools";
import NiceModal from "@ebay/nice-modal-react";
import SettingMenu from "./pages/SettingMenu";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoading, isLoggedIn } = useAuth();

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

  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NiceModal.Provider>
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
