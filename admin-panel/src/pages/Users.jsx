import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const updateRoleHandler = async (id, role, status) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, { role, status }, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating user');
    }
  };

  return (
    <div>
      <div className="header-bar">
        <h2>User Management</h2>
      </div>

      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => updateRoleHandler(user._id, e.target.value, user.status)}
                    style={{ background: 'var(--bg-color)', color: 'white', padding: '0.25rem', borderRadius: '4px' }}
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Author">Author</option>
                    <option value="Editor">Editor</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </td>
                <td>
                  <select 
                    value={user.status} 
                    onChange={(e) => updateRoleHandler(user._id, user.role, e.target.value)}
                    style={{ background: 'var(--bg-color)', color: 'white', padding: '0.25rem', borderRadius: '4px' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => deleteHandler(user._id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
