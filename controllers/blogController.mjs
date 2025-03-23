import BlogService from '../services/BlogService.mjs';

export const getBlogPage = async (req, res) => {
  try {
    const blogs = await BlogService.getBlogs();
    const dates = [...new Set(blogs.map(blog => blog.date ? blog.date.toDateString() : 'Unknown'))];
    res.render('blog', { dates, blogs, user: req.user });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getBlogDetail = async (req, res) => {
  try {
    const blog = await BlogService.getBlogById(req.params.id);
    if (!blog) return res.status(404).send('Blog not found');
    res.render('blog-detail', { blog, user: req.user });
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    res.status(500).send('Internal Server Error');
  }
};