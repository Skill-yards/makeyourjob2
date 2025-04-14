import express from "express";
import  {contactUs} from "../controllers/contact.js"

 
const router = express.Router();

router.route("/consultation").post(contactUs);

export default router;