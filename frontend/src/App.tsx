import { BrowserRouter, Route, Routes } from "react-router";
import StartMenu from "./pages/StartMenu";
import MainMenu from "./pages/MainMenu";
import { AuthProvider } from "./context/AuthContext";
import TestTools from "./components/TestTools";
import NiceModal from "@ebay/nice-modal-react";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NiceModal.Provider>
          {import.meta.env.MODE === "development" && <TestTools />}
          <Routes>
            <Route path="/" element={<StartMenu />} />
            <Route path="/main" element={<MainMenu />} />
          </Routes>
        </NiceModal.Provider>
      </BrowserRouter>
    </AuthProvider>
  );
}
