import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import Blogs from './pages/Blogs';
import EditBlog from './pages/EditBlog';
import Users from './pages/Users';

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={!userInfo ? <Login /> : <Navigate to="/" />} />
      
      {/* Protected Routes */}
      <Route path="/" element={userInfo ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/blogs" />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/create" element={<EditBlog />} />
        <Route path="blogs/edit/:id" element={<EditBlog />} />
        
        {/* Super Admin Only */}
        {userInfo?.role === 'Super Admin' && (
          <Route path="users" element={<Users />} />
        )}
      </Route>
    </Routes>
  );
}

export default App;
