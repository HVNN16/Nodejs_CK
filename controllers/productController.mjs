// import Product from "../models/product.mjs"; 

// const getProductPage = async (req, res) => {
//   try {
//     const products = await Product.find();

//     const categories = [...new Set(products.map((product) => product.category))];

//     res.render("product", {
//       categories,
//       products,
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const getProductDetail = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).send('Không tìm thấy sản phẩm.');
//     }
//     res.render('single_product', { product }); 
//   } catch (error) {
//     res.status(500).send('Lỗi khi lấy chi tiết sản phẩm.');
//   }
// };


// export { getProductDetail, getProductPage };

import Product from "../models/product.mjs"; 

const getProductPage = async (req, res) => {
  try {
    const products = await Product.find();
    const categories = [...new Set(products.map((product) => product.category))];
    res.render("product", {
      categories,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Sửa hàm getProductDetail để trả về JSON thay vì render template
const getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product); // Trả về JSON thay vì render template
  } catch (error) {
    console.error("Error fetching product detail:", error);
    res.status(500).json({ message: 'Error fetching product detail' });
  }
};

// Nếu bạn vẫn cần render template cho web, tạo một hàm riêng
const getProductDetailPage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Không tìm thấy sản phẩm.');
    }
    res.render('single_product', { product });
  } catch (error) {
    res.status(500).send('Lỗi khi lấy chi tiết sản phẩm.');
  }
};

export { getProductPage, getProductDetail, getProductDetailPage };
