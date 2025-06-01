import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";
import db from "./app/models/index.js";

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas!");
        initial();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    })
    .catch((err) => {
        console.error("Cannot connect to MongoDB!", err);
        process.exit();
    });

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: "http://localhost:8081" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Node.js JWT Authentication application." });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);

// Initialize roles
function initial() {
    db.Role.estimatedDocumentCount()
        .then((count) => {
            if (count === 0) {
                new db.Role({ name: "admin" }).save();
                new db.Role({ name: "student" }).save();
                new db.Role({ name: "teacher" }).save();
            }
        })
        .catch((err) => {
            console.error("Error initializing roles:", err);
        });
}
