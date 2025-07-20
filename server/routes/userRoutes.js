import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities } from "../controllers/userController.js";

const userRouters = express.Router();

userRouters.get('/', protect, getUserData);
userRouters.post('/store-recent-search', protect, storeRecentSearchedCities);


export default userRouters;