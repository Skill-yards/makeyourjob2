import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() }); 
 


const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(getCompanyById);
router.put('/company/update/:id', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'gstDocument', maxCount: 1 },
    { name: 'cinDocument', maxCount: 1 },
    { name: 'panDocument', maxCount: 1 },
    { name: 'registrationDocument', maxCount: 1 },
  ]), updateCompany);

export default router;

