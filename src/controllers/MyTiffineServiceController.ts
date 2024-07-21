import { Request, Response } from "express";
import TiffineService from "../models/tiffineService";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/orders";

const getMyTiffineService = async (req: Request, res: Response) => {
    try {
        const tiffineService = await TiffineService.findOne({ user: req.userId });
        if (!tiffineService) {
            return res.status(404).json({ message: "Tiffine Service not found" });
        }
        res.json(tiffineService);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erroe fetching tiffine Service" });
    }
};

const createMyTiffineService = async (req: Request, res: Response) => {
    try {
        const existingTiffineService = await TiffineService.findOne({ user: req.userId });

        if (existingTiffineService) {
            return res
                .status(409)
                .json({ message: "User tiffine service already exists" });
        }

        const imageUrl = await uploadImage(req.file as Express.Multer.File);

        const tiffineService = new TiffineService(req.body);
        tiffineService.imageUrl = imageUrl;
        tiffineService.user = new mongoose.Types.ObjectId(req.userId);
        tiffineService.lastUpdated = new Date();
        await tiffineService.save();

        res.status(201).send(tiffineService);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updateMyTiffineService = async (req: Request, res: Response) => {
    try {
        const tiffineService = await TiffineService.findOne({
            user: req.userId,
        });

        if (!tiffineService) {
            return res.status(404).json({ message: "tiffine Service not found" });
        }

        tiffineService.tiffineServiceName = req.body.tiffineServiceName;
        tiffineService.city = req.body.city;
        tiffineService.country = req.body.country;
        tiffineService.deliveryPrice = req.body.deliveryPrice;
        tiffineService.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        tiffineService.cuisines = req.body.cuisines;
        tiffineService.menuItems = req.body.menuItems;
        tiffineService.lastUpdated = new Date();

        if (req.file) {
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            tiffineService.imageUrl = imageUrl;
        }

        await tiffineService.save();
        res.status(200).send(tiffineService);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getMyTiffineServiceOrders = async (req: Request, res: Response) => {
    try {
      const tiffineService = await TiffineService.findOne({ user: req.userId });
      if (!tiffineService) {
        return res.status(404).json({ message: "tiffineService not found" });
      }
  
      const orders = await Order.find({ tiffineService: tiffineService._id })
        .populate("tiffineService")
        .populate("user");
  
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  };

  const updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "order not found" });
      }
  
      const tiffineService = await TiffineService.findById(order.tiffineService);
  
      if (tiffineService?.user?._id.toString() !== req.userId) {
        return res.status(401).send();
      }
  
      order.status = status;
      await order.save();
  
      res.status(200).json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "unable to update order status" });
    }
  };

const uploadImage = async (file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
};

export default {
    updateOrderStatus,
    getMyTiffineServiceOrders,
    getMyTiffineService,
    createMyTiffineService,
    updateMyTiffineService,
};