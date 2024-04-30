import {
  mysqlAddUserProduct,
  mysqlGetUserProducts,
  mysqlGetSubscriberByEmail,
  mysqlAddSubscribeEmail,
} from "./mysql-pool-controller.mjs";

async function getProducts(req, res, next) {
  if (req.user) {
    const userId = req.user.user_id;
    const products = await mysqlGetUserProducts(userId);
    req.products = products;
  }
  next();
}

async function purchaseProduct(req, res, next) {
  if (req.user) {
    const userId = req.user.user_id;
    const productId = req.body.productId;

    const userProducts = await mysqlGetUserProducts(userId);
    const userProduct = userProducts.find((product) => {
      return product.product_id == productId;
    });
    if (!userProduct.user_id) await mysqlAddUserProduct(userId, productId);
  }
  next();
}

async function subscribeEmail(req, res) {
  const email = req.body.email;
  const results = await mysqlGetSubscriberByEmail(email);

  if (results)
    return res.render("subscribe", {
      message: "That email is already subscribed!",
    });

  await mysqlAddSubscribeEmail(email);
  res.render("subscribe", { email });
}

export { getProducts, purchaseProduct, subscribeEmail };
