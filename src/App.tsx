import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/login";
import Singup from "./pages/signup";
import Profile from "./pages/profile";
import Google from "./pages/google";
import ForgetPassword from "./pages/forgot-password";
function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/google" element={<Google />} />
        <Route path="/" element={token ? <Profile /> : <Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
