const mongoose = require("mongoose");
const Movies = require("./moviesModels");
const User = require("./userModel");

const HistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movies",
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model("History", HistorySchema);

module.exports = History;
