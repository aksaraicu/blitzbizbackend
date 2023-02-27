import express from "express";
import { 
    getListings,
    getListingByID,
    createListing,
    updateListing,
    deleteListing, 
    getListingsAllWithRole,
    updateListingWithRole,
    deleteListingWithRole
} from "../controllers/ListingController.js";

const router = express.Router();

router.get("/listings", getListings);
router.get("/listings/:id", getListingByID);
router.post("/listings", createListing);
router.patch("/listings/:id", updateListing);
router.delete("/listings/:id", deleteListing);
router.get("/listingwithrole", getListingsAllWithRole);
router.patch("/listingwithrole/:id", updateListingWithRole);
router.delete("/listingwithrole/:id", deleteListingWithRole);

export default router;