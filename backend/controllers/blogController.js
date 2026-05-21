import asyncHandler from 'express-async-handler';
import Blog from '../models/Blog.js';
import slugify from 'slugify';

// @desc    Get all blogs (Published for public, all for admin)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
  const { status, category, tag } = req.query;
  let query = {};

  if (status) query.status = status;
  else query.status = 'Published'; // default for public

  // If user is authenticated and is Admin/Editor/Author, they can see drafts
  if (req.user && ['Super Admin', 'Editor', 'Author'].includes(req.user.role)) {
    if (req.query.all === 'true') {
      delete query.status; 
      if (req.user.role === 'Author') {
        query.author = req.user._id; // authors only see their own drafts/blogs in admin panel
      }
    }
  }

  if (category) query.categories = { $in: [category] };
  if (tag) query.tags = { $in: [tag] };

  const blogs = await Blog.find(query).populate('author', 'name email').sort({ createdAt: -1 });
  res.json(blogs);
});

// @desc    Get blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name');
  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private (Super Admin, Editor, Author)
export const createBlog = asyncHandler(async (req, res) => {
  const {
    title, content, metaTitle, metaDescription, featureImage,
    tags, categories, faq, internalLinks, externalLinks, status,
    canonicalUrl, ogTitle, ogDescription, ogImage, twitterCard
  } = req.body;

  const slug = slugify(title, { lower: true, strict: true });
  const existingBlog = await Blog.findOne({ slug });
  if (existingBlog) {
    res.status(400);
    throw new Error('Blog with this title already exists. Please choose a different title.');
  }

  const blog = new Blog({
    title, slug, content, metaTitle, metaDescription, featureImage,
    tags, categories, faq, internalLinks, externalLinks, status,
    canonicalUrl, ogTitle, ogDescription, ogImage, twitterCard,
    author: req.user._id,
  });

  const createdBlog = await blog.save();
  res.status(201).json(createdBlog);
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private (Super Admin, Editor, Author)
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    // Check permissions
    if (req.user.role === 'Author' && blog.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to edit this blog');
    }

    Object.assign(blog, req.body);
    if (req.body.title) {
        blog.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private (Super Admin, Editor, Author)
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (blog) {
    if (req.user.role === 'Author' && blog.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this blog');
    }

    await Blog.deleteOne({ _id: blog._id });
    res.json({ message: 'Blog removed' });
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});
