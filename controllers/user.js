import { User } from "../models/user.js";
import sendEmail from "../middlewares/mail.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Service } from "../models/service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, address, mobile } = req.body;
    let user = await User.findOne({ email });
    if (user)
      return res.status(404).json({
        success: false,
        message: "user already exists",
      });

    user = await User.create({
      name,
      email,
      password,
      address,
      mobile
    });
    res.status(201).json({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "register first",
      });
    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(404).json({
        success: false,
        message: "invalid email or password",
      });

    const token = await user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .json({
        success: true,
        user,
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "logged out successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//for forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    //get reset token
    // const resetToken = user.generateResetToken();
    // await user.save({ validateBeforeSave: false });
    // const resetPasswordUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/v1/reset/password/${resetToken}`;
    const newPassword = "modisarkar";
    // const hashPassword = await bcrypt.hash(newPassword, 10);

    const message = `your new password is:\n\n ${newPassword} \n\n PLEASE UPDATE IT LATER AS SOON AS YOU CAN \n\n if you have not requested this email then please ignore it.`;

    await sendEmail({
      email: user.email,
      subject: `SERVICES4U password recovery`,
      message: message,
    });

    await user.set({ password: newPassword }).save();

    res.status(200).json({
      success: true,
      message: `email sent to ${user.email} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//for reset password
export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "reset token expired or invalid",
    });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(404).json({
      success: false,
      message: "password does not match",
    });
  }

  user.password = req.body.password;
  (user.resetPasswordToken = undefined), (user.resetPasswordExpire = undefined);

  await user.save();
  res.status(200).json({
    success: true,
    message: "password changed successfully",
    user,
  });
};

//get user details(user profile by user)

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//updating the password

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(req.body.oldPassword);
    if (!isMatch)
      return res.status(404).json({
        success: false,
        message: "old password was incorrect",
      });

    if (req.body.newPassword !== req.body.confirmPassword)
      return res.status(404).json({
        success: false,
        message: "password does not match",
      });

    user.password = req.body.newPassword;
    await user.save();
    const token = await user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .json({
        success: true,
        user,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//updating user profiles

export const updateProfile = async (req, res) => {
  const { password, ...data } = req.body;
  let hash;

  if (password) {
    hash = await bcrypt.hash(password, 10);
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...data, password: hash },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "user profile changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//all user profile (by admin)

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// user profile (only admin)

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "user not found",
      });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update user role - (admin can update)
export const updateRole = async (req, res) => {
  try {
    const newProfie = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newProfie, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "user profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete user - (admin)

export const deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "user does not exists",
      });
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addService = async (req, res) => {
  try {
    const data = req.body;
    let user = await Service.create(data);

    res.status(200).json({
      success: true,
      message: "service created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allCategory = async (req, res) => {
  try {
    let services = await Service.find({});
    const categoriesSet = new Set();

    services.forEach((s) => {
      categoriesSet.add(s.category);
    });

    const categories = Array.from(categoriesSet).map((category) => {
      // Find the first service with the category
      const service = services.find((s) => s.category === category);
      return { category, image: service.image };
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getService = async (req, res) => {
  try {
    const { category } = req.query;
    let services = await Service.find({ category });

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



