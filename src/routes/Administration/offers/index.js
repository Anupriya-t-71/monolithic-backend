import express from "express";
import * as AuthModels from "../../../controllers/Administration/offers/index.js"; // Import your controller functions

const authRouter = express.Router();

// Define routes with the correct function names
authRouter.post("/", AuthModels.createOffer);  // Use the correct function here
authRouter.put('/:id', AuthModels.updateOfferById);
authRouter.get("/:id", AuthModels.getOfferById);  // Correct function name
authRouter.get("/", AuthModels.getAllOffers);     // Correct function name
authRouter.post("/apply", AuthModels.applyOfferToOrder); // Correct function name

export default authRouter;

