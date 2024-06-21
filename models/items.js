const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemsSchema = new Schema({
    name: { type: String, required: true, MaxLength: 100 },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Categories", required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, MaxLength: 4 },
    image_url: { type: String }
});

ItemsSchema.virtual("url").get(function () {
    return `/item/${this._id}`
});

module.exports = mongoose.model('Item', ItemsSchema);