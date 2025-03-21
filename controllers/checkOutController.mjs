import Checkout from "../models/checkout.mjs";
import Cart from "../models/cart.mjs";
import User from "../models/user.mjs";

// Show the checkout page
export const checkOutPage = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login'); // Redirect nếu chưa đăng nhập
  }

  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.redirect("/cart");
    }

    const cartItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      total: item.productId.price * item.quantity,
    }));
    const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);

    const user = await User.findById(userId);

    res.render("checkout", {
      cart: { items: cartItems },
      subtotal: subtotal.toFixed(2),
      user: req.user, // Truyền req.user thay vì user từ DB để đồng bộ với CartController
    });
  } catch (error) {
    console.error("Error loading checkout page:", error);
    res.status(500).send("Error loading checkout page");
  }
};

// Create a new checkout order
// checkOutController.mjs
export const createCheckout = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;
  const { firstname, lastname, phone, email, streetaddress, apartment, towncity, country, payment } = req.body;

  // Validation
  const requiredFields = ['firstname', 'lastname', 'phone', 'email', 'streetaddress', 'towncity', 'country', 'payment'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }
  if (!['Cash', 'Card'].includes(payment)) {
    return res.status(400).json({ message: "Invalid payment method. Must be 'Cash' or 'Card'" });
  }

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const checkoutItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));
    const totalPrice = cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

    const newCheckout = new Checkout({
      userId,
      products: checkoutItems,
      totalPrice,
      shippingInfo: { firstname, lastname, phone, email, streetaddress, apartment, towncity, country },
      paymentMethod: payment,
      statusHistory: [{ status: "Pending" }],
    });
    await newCheckout.save();

    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error creating checkout order:", error);
    res.status(500).json({ message: "Error creating checkout order", error: error.message });
  }
};
// Get order history
export const getOrderHistory = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login'); // Đồng bộ với viewCart: redirect thay vì JSON
  }

  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    let query = { userId };
    if (search) {
      query.$or = [
        { _id: search },
        { "shippingInfo.firstname": { $regex: search, $options: "i" } },
        { "shippingInfo.lastname": { $regex: search, $options: "i" } },
      ];
    }

    const totalOrders = await Checkout.countDocuments(query);
    const orders = await Checkout.find(query)
      .populate("products.productId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render("history", {
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      search,
      user: req.user, // Thêm user để header.ejs hoạt động
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).send("Error fetching order history");
  }
};

// Get order detail
export const getOrderDetail = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login'); // Đồng bộ với viewCart
  }

  const userId = req.user.id;
  const orderId = req.params.id;

  try {
    const order = await Checkout.findOne({ _id: orderId, userId }).populate("products.productId");
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.render("order-detail", {
      order,
      user: req.user, // Thêm user để header.ejs hoạt động
    });
  } catch (error) {
    console.error("Error fetching order detail:", error);
    res.status(500).send("Error fetching order detail");
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;
  const orderId = req.params.id;

  try {
    const order = await Checkout.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only Pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    order.statusHistory.push({ status: "Cancelled" });
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Error cancelling order" });
  }
};

export const getOrderHistoryApi = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    let query = { userId };
    if (search) {
      query.$or = [
        { _id: search },
        { "shippingInfo.firstname": { $regex: search, $options: "i" } },
        { "shippingInfo.lastname": { $regex: search, $options: "i" } },
      ];
    }

    const totalOrders = await Checkout.countDocuments(query);
    const orders = await Checkout.find(query)
      .populate("products.productId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      search,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Error fetching order history", error: error.message });
  }
};

export const getOrderDetailApi = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;
  const orderId = req.params.id;

  try {
    const order = await Checkout.findOne({ _id: orderId, userId }).populate("products.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order detail:", error);
    res.status(500).json({ message: "Error fetching order detail", error: error.message });
  }
};