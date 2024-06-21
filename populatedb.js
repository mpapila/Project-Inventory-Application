#! /usr/bin/env node

console.log(
  'This script populates some test items, categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/categories");
const Item = require("./models/items");
const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
}


async function itemCreate(index, name, description, category, price, stock, image_url) {
  const itemDetail = { name: name, description: description, category: category, price: price, stock: stock, image_url: image_url }
  const item = new Item(itemDetail);

  await item.save();
  items[index] = item;
}


async function createCategories() {
  await Promise.all([
    categoryCreate(0, "Home Console", "Gaming consoles designed for home use, typically connected to a TV"),
    categoryCreate(1, "Handheld Console", "Portable gaming devices like Nintendo Switch and PS Vita"),
    categoryCreate(2, "Arcade Video Game", "Games traditionally found in arcades with coin-operated machines"),
  ])
}

async function createItems() {
  // Example items for each category
  await itemCreate(0, "PlayStation 5", "The latest home console from Sony, with advanced graphics and gaming capabilities.", categories[0], 499.99, 100, "https://cdn.mos.cms.futurecdn.net/Q4dWorSKV6c2VVpJKpjMcU-1200-80.jpg");

  await itemCreate(1, "Nintendo Switch", "A versatile handheld console that doubles as a home gaming system.", categories[1], 299.99, 150, "https://i5.walmartimages.com/seo/Nintendo-Switch-w-Neon-Blue-Neon-Red-Joy-Con_8db4edff-200f-4438-a82d-b847c4d991a2.b7f63d217664fa8da40ccba761fbff10.jpeg");

  await itemCreate(2, "Street Fighter II", "Classic arcade fighting game known for its competitive gameplay and iconic characters.", categories[2], 19.99, 50, "https://arcadedirect.co.uk/wp-content/uploads/2023/01/street-fighter-2-arcade-cabinet.jpg");
}


