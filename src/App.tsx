import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/login";
import Singup from "./pages/singup";
import Profile from "./pages/profile";
import Google from "./pages/google";
function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/google" element={<Google />} />
        <Route path="/" element={token ? <Profile /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
