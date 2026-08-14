const express = require("express");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE TRIP
// POST /api/trips
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    const trip = await Trip.create({
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// GET ALL USER TRIPS
// GET /api/trips
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// GET SINGLE TRIP
// GET /api/trips/:id
// ==========================================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// UPDATE TRIP
// PUT /api/trips/:id
// ==========================================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // Ownership check
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this trip",
      });
    }

    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    trip.title = title;
    trip.destination = destination;
    trip.startDate = startDate;
    trip.endDate = endDate;
    trip.description = description;
    trip.rating = rating;

    await trip.save();

    res.status(200).json({
      message: "Trip updated successfully",
      trip,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================================
// DELETE TRIP
// DELETE /api/trips/:id
// ==========================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // Ownership check
    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this trip",
      });
    }

    await trip.deleteOne();

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
