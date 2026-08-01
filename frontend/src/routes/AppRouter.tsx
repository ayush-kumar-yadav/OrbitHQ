import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import NotFoundPage from "../pages/errors/NotFoundPage";
import ProjectsPage from "../pages/projects/ProjectsPage";
import ProtectedRoute from "./ProtectedRoute";
import OrganizationsPage from "../pages/organizations/OrganizationsPage";
import ProjectDetailsPage from "../pages/projects/ProjectDetailsPage";
import TaskDetailsPage from "../pages/tasks/TaskDetailsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
  path="/tasks/:id"
  element={<TaskDetailsPage />}
/>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
    path="/projects"
    element={
        <ProtectedRoute>
            <ProjectsPage />
        </ProtectedRoute>
    }
/>
<Route
  path="/organizations"
  element={
    <ProtectedRoute>
      <OrganizationsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/projects/:id"
  element={<ProjectDetailsPage />}
/>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}