import express from "express";
import { param } from "express-validator";
import TiffineServiceController from "../controllers/TiffineServiceController";

const router = express.Router();

// router.get(
//   "/:restaurantId",
//   param("restaurantId")
//     .isString()
//     .trim()
//     .notEmpty()
//     .withMessage("RestaurantId paramenter must be a valid string"),
//   RestaurantController.getRestaurant
// );
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