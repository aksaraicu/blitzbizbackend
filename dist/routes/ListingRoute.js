"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _ListingController = require("../controllers/ListingController.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.get("/listings", _ListingController.getListings);
router.get("/listings/:id", _ListingController.getListingByID);
router.post("/listings", _ListingController.createListing);
router.patch("/listings/:id", _ListingController.updateListing);
router.delete("/listings/:id", _ListingController.deleteListing);
router.get("/listingwithrole", _ListingController.getListingsAllWithRole);
router.patch("/listingwithrole/:id", _ListingController.updateListingWithRole);
router.delete("/listingwithrole/:id", _ListingController.deleteListingWithRole);
var _default = router;
exports.default = _default;