import { Router } from "express";
import {uploadFile, downloadFile} from "../controllers/basic.controller.js"


const router = Router()

router.route("/upload").post(uploadFile)
router.route("/u/:filename").get(downloadFile)

export default router