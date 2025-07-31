import mongoose, { Schema } from "mongoose";
const likeSchema = new Schema(
  {
    blog_id: {
      type: Schema.Types.ObjectId,
      ref: "blog",
    },
    likes_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Like = mongoose.model("like", likeSchema);
export default Like;
