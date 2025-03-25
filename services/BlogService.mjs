import Blog from '../models/blog.mjs';

// Lấy danh sách tất cả blog
const getBlogs = async () => {
  try {
    const blogs = await Blog.find().sort({ date: -1 }); // Sắp xếp theo ngày giảm dần
    return blogs;
  } catch (error) {
    throw new Error('Error fetching blogs: ' + error.message);
  }
};

// Lấy chi tiết blog theo ID
const getBlogById = async (id) => {
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  } catch (error) {
    throw new Error('Error fetching blog by ID: ' + error.message);
  }
};

// Tạo blog mới
const createBlog = async (blogData) => {
  try {
    const newBlog = new Blog(blogData);
    await newBlog.save();
    return newBlog;
  } catch (error) {
    throw new Error('Error creating blog: ' + error.message);
  }
};

export default {
  getBlogs,
  getBlogById,
  createBlog,
};
