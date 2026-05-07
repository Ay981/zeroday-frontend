import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then((module) => ({ default: module.Register })));
const Verify = lazy(() => import('./pages/Verify').then((module) => ({ default: module.Verify })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const CreateReport = lazy(() => import('./pages/CreateReport').then((module) => ({ default: module.CreateReport })));
const ReportDetail = lazy(() => import('./pages/ReportDetail').then((module) => ({ default: module.ReportDetail })));
const EditReport = lazy(() => import('./pages/EditReport').then((module) => ({ default: module.EditReport })));
const Profile = lazy(() => import('./pages/Profile').then((module) => ({ default: module.Profile })));
const AuthRoute = lazy(() => import('./components/AuthRoute').then((module) => ({ default: module.AuthRoute })));

const RouteFallback = () => (
  <div className="min-h-screen bg-background text-foreground" />
);

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/verify" element={<Verify />} />

        <Route element={<AuthRoute mode="protected" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create" element={<CreateReport />} />
          <Route path="/dashboard/reports/:slug" element={<ReportDetail />} />
          <Route path="/dashboard/reports/:slug/edit" element={<EditReport />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
