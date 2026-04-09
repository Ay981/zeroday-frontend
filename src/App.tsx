import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AuthRoute } from './components/AuthRoute'; // The Guard we discussed

function App() {
  return (
    <Routes>
      {/* //this should be visited only if the user is not authenticated, otherwise it will be redirected to dashboard */}
      <Route element={<AuthRoute mode="guest" />} />
      <Route path="/login" element={<Login />} />
      
      {/* If someone hits the root /, send them to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Routes */}
      <Route element={<AuthRoute mode="protected" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;