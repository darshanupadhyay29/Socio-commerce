import Product from "../models/productModel.js";
import User from "../models/UserModel.js";
import { v2 as cloudinary } from "cloudinary";

const sellProduct = async (req, res) => {
  try {
    const { postedBy, title, price, description, img } = req.body;

    if (!title || !price || !img) {
      return res
        .status(400)
        .json({ error: "Title, Price, and Image are required" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to sell product" });
    }

    let imageUrl = img;
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      imageUrl = uploadedResponse.secure_url;
    }

    const newProduct = new Product({
      postedBy,
      title,
      price,
      description,
      img: imageUrl,
    });
    await newProduct.save();

    return res.status(201).json(newProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

const getUserProducts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
           return res.status(401).json({ error: "User not found" });
        }
        
        const products = await Product.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
}


const getAllProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const feedProducts = await Product.find({
      postedBy: { $ne: userId },
    }).sort({
      createdAt: -1,
    });
      console.log(feedProducts)
      console.log(userId)
    res.status(200).json(feedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export { sellProduct, getUserProducts, getAllProducts };
