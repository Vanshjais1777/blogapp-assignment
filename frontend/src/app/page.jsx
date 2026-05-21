import Link from 'next/link';

async function getBlogs() {
  try {
    const res = await fetch('http://localhost:5000/api/blogs', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function HomePage() {
  const blogs = await getBlogs();

  return (
    <div>
      <div style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover Latest Insights
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Explore tutorials, guides, and career advice for full-stack developers in 2026.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        {blogs.map((blog) => (
          <div key={blog._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            {blog.featureImage && (
              <img src={blog.featureImage} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1.5rem' }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {blog.categories?.map((cat, i) => (
                  <span key={i} style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem' }}>
                    {cat}
                  </span>
                ))}
              </div>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', lineHeight: 1.3 }}>
                <Link href={`/blog/${blog.slug}`} style={{ color: 'white' }}>{blog.title}</Link>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {blog.metaDescription}
              </p>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                By {blog.author?.name || 'Unknown'}
              </span>
              <Link href={`/blog/${blog.slug}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                Read More
              </Link>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            No blogs found.
          </div>
        )}
      </div>
    </div>
  );
}
