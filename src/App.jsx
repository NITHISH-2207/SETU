import { Routes, Route } from "react-router-dom";
import CSRProfile from "./pages/CSRProfile";
import Payment from "./pages/Payment";
import Contribute from "./pages/Contribute";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CSRProfile />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/contribute" element={<Contribute />} />
    </Routes>
  );
}
