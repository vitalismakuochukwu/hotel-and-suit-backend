import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  searchAnnouncements,
  archivePastAnnouncements,
  getArchivedAnnouncements,
} from "../controllers/announcementController.js";

const router = express.Router();

// Archive past announcements (admin only)
router.post("/archive", adminAuth, archivePastAnnouncements);
// Get archived announcements
router.get("/archived", getArchivedAnnouncements);

// Only admins can create, update, delete
router.post("/",  createAnnouncement);
router.put("/:id", adminAuth, updateAnnouncement);
router.delete("/:id",  deleteAnnouncement);
// Anyone can view
router.get("/", getAnnouncements);
// Search and filter
router.get("/search", searchAnnouncements);

export default router;
