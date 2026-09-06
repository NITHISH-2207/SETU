import { useEffect, useState } from "react";
import TataCSRProfile from "./pages/TataCSRProfile";
import Payment from "./pages/Payment";
import Contribute from "./pages/Contribute";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleBack = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  if (path === "/payment") {
    return <Payment />;
  }

  if (path === "/contribute") {
    return <Contribute />;
  }

  return <TataCSRProfile />;
}