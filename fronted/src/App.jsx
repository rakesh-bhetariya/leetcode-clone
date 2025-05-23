import React from "react";
import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignupPage from "./page/SignupPage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

function App() {
  const { authUser, checkAuth, isChekingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isChekingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"login"} />}
        />

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
