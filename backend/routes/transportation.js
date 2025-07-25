const express = require("express");
const router = express.Router();
const transportationController = require("../controllers/transportationController");
const { authenticateToken } = require("../middleware/auth");

// Public routes
router.get("/", transportationController.getAllTransportation);
router.get("/:id", transportationController.getTransportationById);

// Protected routes (admin only)
router.post(
  "/",
  authenticateToken,
  transportationController.createTransportation
);
router.put(
  "/:id",
  authenticateToken,
  transportationController.updateTransportation
);
router.delete(
  "/:id",
  authenticateToken,
  transportationController.deleteTransportation
);
router.patch(
  "/:id/status",
  authenticateToken,
  transportationController.toggleTransportationStatus
);

module.exports = router;