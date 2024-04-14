import express from "express";
import multer from "multer";
import MyTiffineServiceController from "../controllers/MyTiffineServiceController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyTiffineServiceRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});
//GET /api/my/tiffineService
router.get("/", jwtCheck, jwtParse, MyTiffineServiceController.getMyTiffineService);
// api/my/tiffineService
router.post(
  "/",
  upload.single("imageFile"),
  validateMyTiffineServiceRequest,
  jwtCheck,
  jwtParse,
  MyTiffineServiceController.createMyTiffineService
);

router.put("/",
  upload.single("imageFile"),
  validateMyTiffineServiceRequest,
  jwtCheck,
  jwtParse,
  MyTiffineServiceController.updateMyTiffineService
)

export default router;