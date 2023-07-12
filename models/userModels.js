const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    namalengkap: {
      type: String,
      required: true,
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
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "History",
      },
    ],
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
