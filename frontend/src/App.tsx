import { BrowserRouter, Route, Routes } from "react-router";
import StartMenu from "./pages/StartMenu";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartMenu />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
