import "./App.css";
import AppProvider from "./AppContext";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { AuthProvider } from "./providers/authProvider";
import { ArchiveProvider } from "./providers/archiveProvider";
import { useEffect, useState } from "react";
import * as utils from "./utils";

function App() {
  const navigate = useNavigate();
  const ls = useLoaderData();

  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!load) {
      setLoad(true);
      if (!ls) {
        return localStorage.setItem(utils.getAppUID(), "1");
      }

      if (ls) {
        navigate("/dashboard");
      }
    }
  }, [ls, navigate, load]);

  return (
    <AuthProvider>
      <ArchiveProvider>
        <AppProvider>
          <Outlet />
        </AppProvider>
      </ArchiveProvider>
    </AuthProvider>
  );
}

export default App;
