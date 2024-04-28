import express from "express";
import { param } from "express-validator";
import TiffineServiceController from "../controllers/TiffineServiceController";

const router = express.Router();

router.get(
  "/:tiffineServiceId",
  param("tiffineServiceId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("TiffineServiceId paramenter must be a valid string"),
  TiffineServiceController.getTiffineService
);
// api/tiffineService/search/Ahmedabad
router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City paramenter must be a valid string"),
  TiffineServiceController.searchTiffineService
);

export default router;