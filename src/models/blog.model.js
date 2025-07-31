import mongoose, { model, Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Blog = model("blog", blogSchema);
export default Blog;
