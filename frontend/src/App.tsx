import { BrowserRouter, Route, Routes } from "react-router";
import StartMenu from "./pages/StartMenu";
import MainMenu from "./pages/MainMenu";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StartMenu />} />
            <Route path="/main" element={<MainMenu />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
