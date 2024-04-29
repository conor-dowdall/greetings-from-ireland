import {
  addUserProduct,
  getUserProducts,
  getSubscriberByEmail,
  addSubscribeEmail,
} from "./db-pool-controller.mjs";

async function getProducts(req, res, next) {
  if (req.user) {
    const userId = req.user.user_id;
    const products = await getUserProducts(userId);
    req.products = products;
  }
  next();
}

async function buyProduct(req, res, next) {
  if (req.user) {
    const userId = req.user.user_id;
    const productId = req.body.productId;
    await addUserProduct(userId, productId);
  }
  next();
}

async function subscribeEmail(req, res) {
  const email = req.body.email;
  const results = await getSubscriberByEmail(email);

  if (results)
    return res.render("subscribe", {
      message: "That email is already subscribed!",
    });

  await addSubscribeEmail(email);
  res.render("subscribe", { email });
}

export { getProducts, buyProduct, subscribeEmail };
