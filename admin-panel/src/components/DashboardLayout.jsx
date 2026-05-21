import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { LayoutDashboard, FileText, Users, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar glass-panel" style={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0 }}>
        <div style={{ padding: '0 1rem 2rem 1rem' }}>
          <h2>Admin Panel</h2>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {userInfo?.name} ({userInfo?.role})
          </div>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/blogs" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            <FileText size={20} /> Blogs
          </NavLink>
          {userInfo?.role === 'Super Admin' && (
            <NavLink to="/users" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
              <Users size={20} /> Users
            </NavLink>
          )}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className="sidebar-link" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
