import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AuthRoute } from './components/AuthRoute'; // The Guard we discussed
import { CreateReport } from './pages/CreateReport'; // New Page for creating reports
import { ReportDetail } from './pages/ReportDetail'; // New Page for report details
import { EditReport } from './pages/EditReport';
import { Register } from './pages/Register'; // New Page for registration

function App() {
  return (
    <Routes>
      {/* //this should be visited only if the user is not authenticated, otherwise it will be redirected to dashboard */}
      <Route element={<AuthRoute mode="guest" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 


      
      
      {/* If someone hits the root /, send them to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Routes */}
      <Route element={<AuthRoute mode="protected" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create" element={<CreateReport />} />
         <Route path="/dashboard/reports/:slug" element={<ReportDetail />} /> 
         <Route path="/dashboard/reports/:slug/edit" element={<EditReport />} />  
       </Route>
    </Routes>
  );
}

export default App;