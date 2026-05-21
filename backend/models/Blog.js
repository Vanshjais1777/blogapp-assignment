import mongoose from 'mongoose';

const faqSchema = mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const blogSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    canonicalUrl: { type: String },
    featureImage: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    twitterCard: { type: String },
    tags: [{ type: String }],
    categories: [{ type: String }],
    faq: [faqSchema],
    internalLinks: [{ type: String }],
    externalLinks: [{ type: String }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
