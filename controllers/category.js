const Category = require("../models/Category");
const User = require("../models/User");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const categoryExists = await Category.findOne({ name: name });
    if (categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const userId = req.user.id;

    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User Details Not Found",
      });
    }

    // Create Category and populate the 'email' field with the user details
    const categoryDetails = await Category.create({
      name: name,
      email: userDetails._id,
    });

    const addedCategory = await User.findByIdAndUpdate(
      {
        _id: userDetails._id,
      },
      {
        $push: {
          categories: categoryDetails._id,
        },
      },
      { new: true }
    );

    if (!addedCategory) {
      return res.status(404).json({
        success: false,
        message: "Can not add category",
      });
    }

    // Populate the 'email' field in the created Category
    const populatedCategory = await Category.populate(categoryDetails, {
      path: "email",
      //   select: 'email',
    });

    return res.status(200).json({
      success: true,
      categoryDetails: populatedCategory,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
