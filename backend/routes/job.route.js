import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob, adminGetJob, searchJob, getSimilarJobs,searchJobsByCriteria,AdminedeleteJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
// router.route("/getadminjobs").get(getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route("/admin-get/:id").get(isAuthenticated, adminGetJob)
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/delete/:id").delete(isAuthenticated, AdminedeleteJob);
router.route("/search").get(searchJob);
/// create route for the searchCriteria
router.route("/searchCriteria").get(searchJobsByCriteria);
router.route("/similar/:id").get(getSimilarJobs)
export default router;

