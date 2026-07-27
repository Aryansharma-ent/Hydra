import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("hydra_token");

  if (!token) {
    // If no token exists, immediately redirect to /login
    return <Navigate to="/login" replace />;
  }

  return children;
}
