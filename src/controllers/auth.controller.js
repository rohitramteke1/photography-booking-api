const {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserProfile, // Only this one needed!
    deleteUserById,
} = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt.js");

// REGISTER
exports.register = async (req, res, next) => {
    console.log('Backend received registration request body:', req.body);
    try {
        const { firstName, lastName, email, password, confirmPassword, role } = req.body;
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || "user",
        });
        const token = generateToken(newUser);
        res.status(201).json({
            success: true,
            token,
            user: { ...newUser, password: undefined },
        });
    } catch (err) {
        next(err);
    }
};

// LOGIN
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide an email and password" });
        }
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // TODO: FIX THIS
        // TEMP: Compare plain password (for non-hashed users)
        const isMatch =
            user.password === password || await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);
        res.status(200).json({
            success: true,
            token,
            user: { ...user, password: undefined },
        });
    } catch (err) {
        next(err);
    }
};

// LOGOUT
exports.logout = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Logged out",
    });
};

// GET ME
exports.getMe = async (req, res, next) => {
    try {
        const user = await findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            data: { ...user, password: undefined },
        });
    } catch (err) {
        next(err);
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide current and new password" });
        }
        const user = await findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Use updateUserProfile for password change
        await updateUserProfile(req.user.id, { password: hashedPassword });
        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const updateFields = {};
        const { firstName, lastName, phone, bio, address, city, instagram } = req.body;

        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        // DO NOT include email here!
        if (phone) updateFields.phone = phone;
        if (bio) updateFields.bio = bio;
        if (address) updateFields.address = address;
        if (city) updateFields.city = city;
        if (instagram) updateFields.instagram = instagram;

        const updatedUser = await updateUserProfile(req.user.id, updateFields);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: { ...updatedUser, password: undefined },
        });
    } catch (err) {
        next(err);
    }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res, next) => {
    try {
        const user = await findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await deleteUserById(req.user.id);
        res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (err) {
        next(err);
    }
};