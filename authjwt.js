// app/middlewares/authJwt.js
import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models/index.js";

const User = db.User;
const Role = db.Role;

const verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    try {
        const decoded = jwt.verify(token, config.secret);
        req.userId = decoded.id;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
};

const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const roles = await Role.find({ _id: { $in: req.user.roles } });
            const hasRole = roles.some((role) => role.name === requiredRole);

            if (!hasRole) {
                return res.status(403).json({ message: `Require ${requiredRole} role!` });
            }

            next();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
};

const authJwt = {
    verifyToken,
    isAdmin: checkRole("admin"),
    isStudent: checkRole("student"),
    isTeacher: checkRole("teacher"),
};

export default authJwt;
