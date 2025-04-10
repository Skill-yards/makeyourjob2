import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.route("/register").post(
  upload.fields([
    { name: "logo", maxCount: 1 }, // Field for logo file
    { name: "crnCertificate", maxCount: 5 }, // Field for CRN certificate file
  ]),
  registerCompany
);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router
  .route("/update/:id")
  .put(isAuthenticated, upload.single("file"), updateCompany);

router.route("/update/:companyId/documents").put(
  isAuthenticated,
  upload.fields([
    { name: "logo", maxCount: 1 }, // Field for logo file
    { name: "crnCertificate", maxCount: 1 }, // Field for CRN certificate file
  ]),
  updateCompany
);

export default router;
