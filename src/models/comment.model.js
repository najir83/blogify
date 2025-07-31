import mongoose, { Schema } from "mongoose";
const commentSchema = new Schema(
  {
    data: {
      type: String,
      required: true,
    },
    blog_id: {
      type: Schema.Types.ObjectId,
      ref: "blog",
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);
export default Comment;
