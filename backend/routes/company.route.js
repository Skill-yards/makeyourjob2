import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany,getComnanyByUserId,updateCompanyStatus,fetchCompanyStatus} from "../controllers/company.controller.js";
import {verifyAdmin } from "../middlewares/adminVerify.js"
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() }); 
 


const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(getCompanyById);
router.route("/getAllCompany").get(getComnanyByUserId);
router.route('/companies/status').get(isAuthenticated,fetchCompanyStatus)
router.route("/update/:id").put(verifyAdmin,updateCompanyStatus);
router.put('/company/update/:id', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'gstDocument', maxCount: 1 },
    { name: 'cinDocument', maxCount: 1 },
    { name: 'panDocument', maxCount: 1 },
    { name: 'registrationDocument', maxCount: 1 },
  ]), updateCompany);

export default router;

