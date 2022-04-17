const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
        type: Schema.Types.ObjectId,
        ref: "Product"
    }
  ],
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
