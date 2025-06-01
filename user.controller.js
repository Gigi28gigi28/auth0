// app/controllers/user.controller.js
export const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
export const adminDashboard = (req, res) => {
    res.status(200).send("Welcome Admin!");
};

export const studentProfile = (req, res) => {
    res.status(200).send("Student Profile Page");
};

export const teacherBoard = (req, res) => {
    res.status(200).send("Teacher Dashboard");
};
