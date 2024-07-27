import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
    price: {
      type: String,
    },
    description: {
      type: String,
    },
    img: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model("Product", productSchema);

export default Product;
