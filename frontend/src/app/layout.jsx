import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: {
    default: 'TechBlog | Modern Perspectives',
    template: '%s | TechBlog'
  },
  description: 'A platform for sharing technical knowledge, tutorials, and career advice.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="hero-bg"></div>
        <nav style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
            Tech<span style={{ color: 'var(--primary)' }}>Blog</span>
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/" style={{ color: 'var(--text-main)' }}>Home</Link>
            <Link href="/about" style={{ color: 'var(--text-main)' }}>About</Link>
          </div>
        </nav>
        
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh' }}>
          {children}
        </main>
        
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>© {new Date().getFullYear()} TechBlog. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
