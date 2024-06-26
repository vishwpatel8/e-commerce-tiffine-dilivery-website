import { Request, Response } from "express";
import TiffineService from "../models/tiffineService";

const getTiffineService = async (req: Request, res: Response) => {
  try {
        const tiffineServiceId = req.params.tiffineServiceId;

        const tiffineService = await TiffineService.findById(tiffineServiceId);
        if (!tiffineService) {
          return res.status(404).json({ message: "tiffineService not found" });
        }

        res.json(tiffineService);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
      }
  };

  const searchTiffineService = async (req: Request, res: Response) => {
    try {
      const city = req.params.city;

      const searchQuery = (req.query.searchQuery as string) || "";
      const selectedCuisines = (req.query.selectedCuisines as string) || "";
      const sortOption = (req.query.sortOption as string) || "lastUpdated";
      const page = parseInt(req.query.page as string) || 1;

      let query: any = {};
      // ahmedabad=Ahmedabad
      query["city"] = new RegExp(city, "i");
      const cityCheck = await TiffineService.countDocuments(query);
      if (cityCheck === 0) {
        return res.status(404).json({
          data: [],
          pagination: {
            total: 0,
            page: 1,
            pages: 1,
          },
        });
      }

      if (selectedCuisines) {  // URL=SelectedCuisines=Kathiyawadi,Gujarati,Punjabi,Lunch
        //[Kathiyawadi,Gujarati,Punjabi,Lunch]
        const cuisinesArray = selectedCuisines
          .split(",")
          .map((cuisine) => new RegExp(cuisine, "i"));

        query["cuisines"] = { $all: cuisinesArray };
      }

      if (searchQuery) {
        //tiffineServiceNmae = Sweta's Kitchen
        //cuisines =[Kathiyawadi,Desert,Lunch,Dhokla]
        //searchQuery= Desert
        const searchRegex = new RegExp(searchQuery, "i");
        query["$or"] = [
          { tiffineServiceName: searchRegex },
          { cuisines: { $in: [searchRegex] } },
        ];
      }

      const pageSize = 10;
      const skip = (page - 1) * pageSize;

      // sortOption = "lastUpdated"
      const tiffineServices = await TiffineService.find(query)
        .sort({ [sortOption]: 1 })
        .skip(skip)
        .limit(pageSize)
        .lean();

      const total = await TiffineService.countDocuments(query);

      const response = {
        data: tiffineServices,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / pageSize), // 50 results pageSize= 10 > pages 5
        },
      };

      res.json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  export default {
      getTiffineService,
    searchTiffineService,
  };