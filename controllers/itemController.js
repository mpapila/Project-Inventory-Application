const Item = require("../models/items")
const Category = require("../models/categories")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
    const [numCategories, numItems] = await Promise.all([
        Item.countDocuments({}).exec(),
        Category.countDocuments({}).exec()
    ]);
    res.render("index", {
        title: "Inventory",
        category_count: numCategories,
        item_count: numItems,
    })
})

exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item
        .find({})
        .sort({ index: 1 })
        .populate("category")
        .exec()

    res.render("item_list", {
        title: "Item List",
        item_list: allItems
    });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec()

    if (item === null) {
        const err = new Error("Item Not Found")
        err.status = 404
        return next(err)
    }
    res.render("item_detail", {
        title: item.name,
        item: item,
    })
})

exports.item_create_get = asyncHandler(async (req, res, next) => {

    const allCategories = await Category.find().sort({ name: 1 }).exec()


    res.render("item_form", {
        title: "Create Item",
        AllCategories: allCategories,
    });
});

exports.item_create_post = [

    (req, res, next) => {
        if (!Array.isArray(req.body.category)) {
            req.body.category =
                typeof req.body.category === "undefined" ? [] : [req.body.category];
        }
        next();
    },

    body("name", "Item name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description")
        .trim()
        .escape(),
    body("price")
        .trim()
        .escape(),
    body("stock")
        .trim()
        .escape(),
    body("image_url")
        .trim()
        .escape(),
    body("category*").escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            image_url: req.body.image_url,
            category: req.body.category,
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category.find({}).select('name _id').sort({ name: 1 }).exec()

            for (const category of allCategories) {
                if (item.category.includes(category._id)) {
                    category.checked = "true";
                }
            }
            res.render("item_form", {
                title: "Create Item",
                AllCategories: allCategories,
                item: item,
                errors: errors.array(),
            });
        } else {
            await item.save()
            res.redirect(item.url)
        }
    })
]

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec();

    if (item === null) {
        res.redirect("/items");
    }

    res.render("item_delete", {
        title: "Delete Item",
        item: item
    });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec()

    await Item.findByIdAndDelete(req.body.id);
    res.redirect("/items")
})

exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [item, allCategories] = await Promise.all([
        Item.findById(req.params.id).exec(),
        Category.find().sort({ name: 1 }).exec(),
    ])

    if (item === null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_form", {
        title: "Update Item",
        item: item,
        AllCategories: allCategories
    })
})

exports.item_update_post = [
    (req, res, next) => {
        if (!Array.isArray(req.body.category)) {
            req.body.category =
                typeof req.body.category === "undefined" ? [] : [req.body.category];
        }
        next();
    },

    body("name", "Item name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description")
        .trim()
        .escape(),
    body("price")
        .trim()
        .escape(),
    body("stock")
        .trim()
        .escape(),
    body("image_url")
        .trim()
        .escape(),
    body("category*").escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            image_url: req.body.image_url,
            category: req.body.category,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category.find({}).select('name _id').sort({ name: 1 }).exec()

            for (const category of allCategories) {
                if (item.category.includes(category._id)) {
                    category.checked = "true";
                }
            }
            res.render("item_form", {
                title: "Update Item",
                AllCategories: allCategories,
                item: item,
                errors: errors.array(),
            });
            return;
        } else {
            const thelist = await Item.findByIdAndUpdate(req.params.id, item, {})

            res.redirect(thelist.url)
        }
    })
]