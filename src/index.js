import express from "express";
import cors from "cors";
import PostRoute from "./routes/PostRoute.js";
import UserRoute from "./routes/UserRoute.js";
import ListingRoute from "./routes/ListingRoute.js";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();
app.use(cors({ credentials:true, origin:process.env.CLIENT_URL }));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload());

app.use(express.static("public"));

app.use(PostRoute);
app.use(UserRoute);
app.use(ListingRoute);

app.listen();
