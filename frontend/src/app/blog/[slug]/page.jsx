import { notFound } from 'next/navigation';

async function getBlog(slug) {
  try {
    const res = await fetch(`http://localhost:5000/api/blogs/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);
  if (!blog) return { title: 'Not Found' };

  return {
    title: blog.metaTitle,
    description: blog.metaDescription,
    alternates: {
      canonical: blog.canonicalUrl || `/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.ogTitle || blog.metaTitle,
      description: blog.ogDescription || blog.metaDescription,
      url: `/blog/${blog.slug}`,
      images: [
        {
          url: blog.ogImage || blog.featureImage || '',
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: blog.twitterCard || 'summary_large_image',
      title: blog.ogTitle || blog.metaTitle,
      description: blog.ogDescription || blog.metaDescription,
      images: [blog.ogImage || blog.featureImage || ''],
    },
  };
}

export default async function BlogDetails({ params }) {
  const blog = await getBlog(params.slug);
  if (!blog) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    image: blog.featureImage,
    author: {
      '@type': 'Person',
      name: blog.author?.name || 'Unknown',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechBlog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png',
      },
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    description: blog.metaDescription,
  };

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {blog.featureImage && (
        <img 
          src={blog.featureImage} 
          alt={blog.title} 
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '2rem' }}
        />
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {blog.categories?.map((cat, i) => (
          <span key={i} style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '0.25rem 1rem', borderRadius: '999px', fontSize: '0.875rem' }}>
            {cat}
          </span>
        ))}
      </div>

      <h1 style={{ fontSize: '3rem', lineHeight: 1.2, marginBottom: '1.5rem', color: 'white' }}>
        {blog.title}
      </h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '2.5rem', color: 'var(--text-muted)' }}>
        <div>
          By <span style={{ color: 'white', fontWeight: 500 }}>{blog.author?.name || 'Unknown'}</span>
        </div>
        <div>
          {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div 
        className="blog-content"
        style={{ fontSize: '1.125rem', color: 'var(--text-main)', lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />

      {blog.tags && blog.tags.length > 0 && (
        <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Tags</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {blog.tags.map((tag, i) => (
              <span key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.25rem 1rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
