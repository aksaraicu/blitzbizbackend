"use strict";

var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _PostRoute = _interopRequireDefault(require("./routes/PostRoute.js"));
var _UserRoute = _interopRequireDefault(require("./routes/UserRoute.js"));
var _ListingRoute = _interopRequireDefault(require("./routes/ListingRoute.js"));
var _expressFileupload = _interopRequireDefault(require("express-fileupload"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_dotenv.default.config();
const app = (0, _express.default)();
app.use((0, _cors.default)({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use((0, _cookieParser.default)());
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.use((0, _expressFileupload.default)());
app.use(_express.default.static("public"));
app.use(_PostRoute.default);
app.use(_UserRoute.default);
app.use(_ListingRoute.default);
app.listen("5000", () => console.log("Server up and running "));