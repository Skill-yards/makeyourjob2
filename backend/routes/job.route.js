import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob, adminGetJob, SearchJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route("/admin-get/:id").get(isAuthenticated, adminGetJob)
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/search").get(isAuthenticated,SearchJob );
export default router;

