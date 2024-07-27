import express from "express";
import { getUserProducts, sellProduct } from "../controllers/productControllers.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post('/sellproduct', protectRoute, sellProduct);
router.get('/product/:username', getUserProducts);

export default router;