import express from "express"
import { createPlacemetControl, fetchPlacementControl, updatePlacementControl ,fetchAllPlacementsControl, deletePlacementControl} from "../../../controllers/Institutes/Placements/index.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js"

const PlacementRouter = express.Router()
PlacementRouter.get("/fetch/:studentId",fetchPlacementControl)
PlacementRouter.post("/create",createPlacemetControl)
PlacementRouter.put("/update",updatePlacementControl)
PlacementRouter.get("/all",fetchAllPlacementsControl)
PlacementRouter.delete("/delete/:id",deletePlacementControl)

export default PlacementRouter