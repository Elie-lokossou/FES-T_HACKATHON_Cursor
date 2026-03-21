import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import AdminParcoursPage from "./pages/AdminParcoursPage";
import ConfidentialitePage from "./pages/ConfidentialitePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MatchingPage from "./pages/MatchingPage";
import MenteeHomePage from "./pages/MenteeHomePage";
import MentorInboxPage from "./pages/MentorInboxPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import MessagesPage from "./pages/MessagesPage";
import NotFoundPage from "./pages/NotFoundPage";
import ParcoursPage from "./pages/ParcoursPage";
import RegisterPage from "./pages/RegisterPage";
import RoleRedirectPage from "./pages/RoleRedirectPage";
import TarifsPage from "./pages/TarifsPage";

const ROLES_MENTEE = ["mentee", "admin"];
const ROLES_MENTOR = ["mentor", "admin"];
const ROLES_MSG = ["mentee", "mentor", "admin"];
const ROLES_PARCOURS = ["mentee", "mentor", "admin"];

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ——— Site public ——— */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/tarifs" element={<TarifsPage />} />
          <Route path="/confidentialite" element={<ConfidentialitePage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />

          {/* ——— Application authentifiée ——— */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleRedirectPage />} />
            <Route
              path="mentee"
              element={
                <RoleRoute roles={ROLES_MENTEE}>
                  <MenteeHomePage />
                </RoleRoute>
              }
            />
            <Route
              path="matching"
              element={
                <RoleRoute roles={ROLES_MENTEE}>
                  <MatchingPage />
                </RoleRoute>
              }
            />
            <Route
              path="messages"
              element={
                <RoleRoute roles={ROLES_MSG}>
                  <MessagesPage />
                </RoleRoute>
              }
            />
            <Route
              path="parcours"
              element={
                <RoleRoute roles={ROLES_PARCOURS}>
                  <ParcoursPage />
                </RoleRoute>
              }
            />
            <Route
              path="mentor"
              element={
                <RoleRoute roles={ROLES_MENTOR}>
                  <MentorInboxPage />
                </RoleRoute>
              }
            />
            <Route
              path="admin/parcours"
              element={
                <RoleRoute roles={["admin"]}>
                  <AdminParcoursPage />
                </RoleRoute>
              }
            />
          </Route>

          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
