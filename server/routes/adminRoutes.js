const express = require("express");
const { listAllVehicles, removeVehicle, listUsers, setUserBlocked } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const adminRouter = express.Router();

adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get("/vehicles", listAllVehicles);
adminRouter.patch("/vehicles/:id/remove", removeVehicle);
adminRouter.get("/users", listUsers);
adminRouter.patch("/users/:id/block", setUserBlocked);

module.exports = adminRouter;
