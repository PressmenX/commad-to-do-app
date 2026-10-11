import { BrowserRouter, Route, Routes } from "react-router";
import StartMenu from "./pages/StartMenu";
import MainMenu from "./pages/MainMenu";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartMenu />} />
          <Route path="/main" element={<MainMenu />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
