const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");
const Transaction = require("../model/Transactions");
const categoryController = {
  create: asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
      throw new Error("Name and type are required");
    }
    const normalizedName = name.toLowerCase();
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      throw new Error("Invalid category type" + type);
    }
    const categoryExists = await Category.findOne({
      name: normalizedName,
      user: req.user,
    });
    if (categoryExists) {
      throw new Error(`Category ${categoryExists.name} already exists`);
    }
    const category = await Category.create({
      name: normalizedName,
      user: req.user,
      type,
    });
    res.status(201).json({ category });
  }),
  lists: asyncHandler(async (req, res) => {
    const categories = await Category.find({ user: req.user });
    res.status(200).json(categories);
  }),
  update: asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { type, name } = req.body;
    const normalizedName = name.toLowerCase();
    const category = await Category.findById(categoryId);
    if (!category && category.user.toString() !== req.user.toString()) {
      throw new Error("Category not found or user not authorized");
    }
    const oldName = category.name;
    category.name = normalizedName || category.name;
    category.type = type;
    const updatedCategory = await category.save();
    if (oldName !== updatedCategory.name) {
      await Transaction.updateMany(
        {
          user: req.user,
          category: oldName,
        },
        { $set: { category: updatedCategory.name } }
      );
    }
    res.json(updatedCategory);
  }),
  delete: asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category && category.user.toString() === req.user.toString()) {
      const defaultCategory = "Uncategorized";
      await Transaction.updateMany(
        {
          user: req.user,
          category: category._id,
        },
        { $set: { category: defaultCategory } }
      );
      await Category.findByIdAndDelete(req.params.id);
      res.json({ messege: "category removed and transactions updated" });
    } else {
      res.json({ messege: "Category not found or user not authorized" });
    }
  }),
};
module.exports = categoryController;
