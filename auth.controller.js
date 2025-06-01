// app/controllers/auth.controller.js
import config from "../config/auth.config.js";
import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = db.User;
const Role = db.Role;
export const signin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate("roles", "-__v");

        if (!user) {
            return res.status(404).json({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null,
                message: "Invalid Password!",
            });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            algorithm: "HS256",
            expiresIn: 86400, // 24 hours
        });

        const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

        res.status(200).json({
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            roles: authorities,
            accessToken: token,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const signup = async (req, res) => {
    try {
        const {
            fullname,
            email,
            password,
            confirmPassword,
            address,
            dateofbirth,
            phonenumber,
            socialmedia,
            roles,
            degree,
            educationLevel,
            major,
            academicYear,
            cv,
            specialization,
            experience,
        } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const hashedPassword = bcrypt.hashSync(password, 8);

        const userData = {
            fullname,
            email,
            password: hashedPassword,
            confirmPassword,
            address,
            dateofbirth,
            phonenumber,
            socialmedia,
        };

        // Add role-specific fields only if the role applies:
        if (roles.includes("student")) {
            userData.degree = degree;
            userData.educationLevel = educationLevel;
            userData.major = major;
            userData.academicYear = academicYear;
            userData.studentCV = cv;
        }

        if (roles.includes("teacher")) {
            userData.specialization = specialization;
            userData.experience = experience;
            userData.teacherCV = cv;
        }

        // Admin could have specific fields too, add here if needed

        const user = new User(userData);

        // Assign roles
        if (roles && roles.length > 0) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            user.roles = foundRoles.map(role => role._id);
        } else {
            const defaultRole = await Role.findOne({ name: "student" });
            user.roles = [defaultRole._id];
        }

        await user.save();

        res.status(201).json({ message: "User was registered successfully!" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
