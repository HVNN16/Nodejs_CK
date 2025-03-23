import Blog from '../models/blog.mjs';

class BlogService {
  static async getBlogs() {
    return Blog.find();
  }

  static async getBlogById(id) {
    return Blog.findById(id);
  }
}

export default BlogService;
