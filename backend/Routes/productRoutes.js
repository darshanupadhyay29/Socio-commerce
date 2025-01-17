import express from "express";
import { getAllProducts, getProduct, getUserProducts, sellProduct } from "../controllers/productControllers.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post('/sellproduct', protectRoute, sellProduct);
router.get('/product/:username', getUserProducts);
router.get("/allproducts", protectRoute, getAllProducts);
router.get("/:id", protectRoute, getProduct);

export default router;