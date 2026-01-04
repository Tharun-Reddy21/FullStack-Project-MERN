import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "mentor", "agent", "developer", "user"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

//model creation

const User = mongoose.model("User", userSchema);

export default User;
