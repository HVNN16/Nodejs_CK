export const getSingleProductPage = (req, res) => {
    res.render('single_product', { title: 'Single Product Page', user: req.user }); // Truyền biến user
  };