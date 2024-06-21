const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true },
})

CategoriesSchema.virtual("url").get(function () {
    return `/category/${this._id}`
});

module.exports = mongoose.model("Categories", CategoriesSchema);