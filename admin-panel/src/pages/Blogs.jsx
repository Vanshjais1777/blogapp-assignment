import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/blogs?all=true', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setBlogs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        fetchBlogs();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting blog');
      }
    }
  };

  return (
    <div>
      <div className="header-bar">
        <h2>Blogs</h2>
        <Link to="/blogs/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Create Blog
        </Link>
      </div>

      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>{blog.author?.name}</td>
                <td>
                  <span className={`badge ${blog.status === 'Published' ? 'active' : 'inactive'}`}>
                    {blog.status}
                  </span>
                </td>
                <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to={`/blogs/edit/${blog._id}`} style={{ color: 'var(--primary-color)' }}>
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => deleteHandler(blog._id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No blogs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
