// app/routes/user.routes.js
import express from "express";
import { authJwt } from "../middlewares/index.js";
import {
    adminDashboard,
    studentProfile,
    teacherBoard,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/admin/dashboard", [authJwt.verifyToken, authJwt.isAdmin], adminDashboard);
router.get("/student/profile", [authJwt.verifyToken, authJwt.isStudent], studentProfile);
router.get("/teacher/board", [authJwt.verifyToken, authJwt.isTeacher], teacherBoard);

export default router;
