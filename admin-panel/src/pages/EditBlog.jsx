import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    featureImage: '',
    ogTitle: '',
    ogDescription: '',
    tags: '',
    categories: '',
    status: 'Draft'
  });

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/blogs?all=true`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          const blog = data.find((b) => b._id === id);
          if (blog) {
            setFormData({
              title: blog.title,
              content: blog.content,
              metaTitle: blog.metaTitle,
              metaDescription: blog.metaDescription,
              canonicalUrl: blog.canonicalUrl || '',
              featureImage: blog.featureImage || '',
              ogTitle: blog.ogTitle || '',
              ogDescription: blog.ogDescription || '',
              tags: blog.tags ? blog.tags.join(', ') : '',
              categories: blog.categories ? blog.categories.join(', ') : '',
              status: blog.status
            });
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchBlog();
    }
  }, [id, userInfo.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()),
      categories: formData.categories.split(',').map((c) => c.trim()),
    };

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/blogs/${id}`, payload, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
      } else {
        await axios.post('http://localhost:5000/api/blogs', payload, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
      }
      navigate('/blogs');
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving blog');
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Blog' : 'Create Blog'}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input className="input-field" type="text" placeholder="Blog Title (H1)" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        
        <div style={{ background: 'white', color: 'black', borderRadius: '8px', overflow: 'hidden' }}>
          <ReactQuill theme="snow" value={formData.content} onChange={(content) => setFormData({ ...formData, content })} style={{ height: '300px' }} />
        </div>
        <div style={{ marginTop: '2.5rem' }}></div>

        <h3>SEO Fields</h3>
        <input className="input-field" type="text" placeholder="Meta Title" value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} required />
        <textarea className="input-field" placeholder="Meta Description" value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} required rows={3}></textarea>
        <input className="input-field" type="text" placeholder="Canonical URL" value={formData.canonicalUrl} onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })} />
        <input className="input-field" type="text" placeholder="Feature Image URL" value={formData.featureImage} onChange={(e) => setFormData({ ...formData, featureImage: e.target.value })} />
        
        <h3>Social / Open Graph</h3>
        <input className="input-field" type="text" placeholder="OG Title" value={formData.ogTitle} onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })} />
        <input className="input-field" type="text" placeholder="OG Description" value={formData.ogDescription} onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })} />

        <h3>Taxonomy</h3>
        <input className="input-field" type="text" placeholder="Tags (comma separated)" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
        <input className="input-field" type="text" placeholder="Categories (comma separated)" value={formData.categories} onChange={(e) => setFormData({ ...formData, categories: e.target.value })} />

        <h3>Status</h3>
        <select className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>

        <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>
          {id ? 'Update Blog' : 'Publish Blog'}
        </button>
      </form>
    </div>
  );
}
